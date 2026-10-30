import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

interface WorkspaceManifest {
	workspaces?: string[] | { packages?: string[] };
}

const IGNORED_DIRECTORIES = new Set([
	'.cache',
	'.git',
	'.next',
	'.nuxt',
	'.turbo',
	'build',
	'coverage',
	'dist',
	'node_modules',
]);

/**
 * Read the workspace patterns from `package.json#workspaces`, supporting both
 * the array and the `{ packages }` form.
 *
 * A missing or unreadable manifest is not an error: workspaces are optional,
 * so it resolves to "no patterns" instead of throwing during config load.
 */
function readWorkspacePatterns(rootDirectory: string): string[] {
	try {
		const manifest = JSON.parse(
			readFileSync(path.join(rootDirectory, 'package.json'), 'utf8')
		) as WorkspaceManifest;
		const workspaces = manifest.workspaces;

		return Array.isArray(workspaces) ? workspaces : (workspaces?.packages ?? []);
	} catch {
		return [];
	}
}

/**
 * Whether a directory is a workspace package, which every workspace entry is
 * expected to be: npm, pnpm, Bun and Yarn only match directories with a
 * manifest.
 */
function isPackageDirectory(directory: string): boolean {
	return existsSync(path.join(directory, 'package.json'));
}

function readSubdirectories(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true })
		.filter(entry => entry.isDirectory() && !IGNORED_DIRECTORIES.has(entry.name))
		.map(entry => path.join(directory, entry.name));
}

/**
 * Match a single directory name against a pattern segment, supporting `*` as
 * "any characters" (`packages/app-*`) without crossing the `/` boundary.
 */
function isSegmentMatch(name: string, segment: string): boolean {
	const escaped = segment.replaceAll(/[.+?^${}()|[\]\\]/gu, String.raw`\$&`).replaceAll('*', '.*');

	return new RegExp(`^${escaped}$`, 'u').test(name);
}

/**
 * Expand the remaining pattern segments from a directory.
 *
 * `**` matches zero or more directories, `*` matches one directory and any
 * other segment is a literal name. Matches are package directories only, and
 * build or dependency directories are never traversed.
 */
function expandSegments(directory: string, segments: string[]): string[] {
	if (!existsSync(directory)) {
		return [];
	}

	const [segment, ...remaining] = segments;

	if (!segment) {
		return isPackageDirectory(directory) ? [directory] : [];
	}

	if (segment === '**') {
		return [
			...expandSegments(directory, remaining),
			...readSubdirectories(directory).flatMap(child => expandSegments(child, segments)),
		];
	}

	const candidates = segment.includes('*')
		? readSubdirectories(directory).filter(child => isSegmentMatch(path.basename(child), segment))
		: [path.join(directory, segment)];

	return candidates.flatMap(candidate => expandSegments(candidate, remaining));
}

/**
 * Expand a workspace pattern into package directories, sorted so detection
 * stays deterministic across filesystems.
 */
function expandPattern(rootDirectory: string, pattern: string): string[] {
	const cleaned = pattern.replace(/^\.\//u, '').replaceAll(/\/+$/gu, '');

	if (cleaned.length === 0 || path.isAbsolute(cleaned)) {
		return [];
	}

	const segments = cleaned.split('/').filter(Boolean);

	return expandSegments(rootDirectory, segments).toSorted((first, second) => first.localeCompare(second));
}

/**
 * Apply one workspace pattern to the directory set: positive patterns add
 * matches and negated patterns remove them.
 */
function applyPattern(directories: Set<string>, root: string, pattern: string): void {
	const isNegated = pattern.startsWith('!');
	const matches = expandPattern(root, isNegated ? pattern.slice(1) : pattern);

	for (const directory of matches) {
		if (directory === root) {
			continue;
		}

		if (isNegated) {
			directories.delete(directory);
		} else {
			directories.add(directory);
		}
	}
}

/**
 * List the directories of a workspace: the root plus every package directory
 * matched by `package.json#workspaces`.
 *
 * Nested patterns, `**` and negations (a pattern prefixed with `!`) are
 * supported. Negations remove an already matched package, so a pattern list
 * can exclude part of the workspace. Used to detect dependencies and tsconfigs
 * that live in a child package instead of the repository root.
 */
export default function getWorkspaceDirectories(rootDirectory: string = process.cwd()): string[] {
	const root = path.resolve(rootDirectory);
	const directories = new Set<string>([root]);

	for (const pattern of readWorkspacePatterns(root)) {
		applyPattern(directories, root, pattern);
	}

	return [...directories];
}
