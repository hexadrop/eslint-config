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

const PNPM_PACKAGES_KEY = 'packages:';
const PNPM_WORKSPACE_FILE = 'pnpm-workspace.yaml';

/**
 * Read the workspace patterns from `package.json#workspaces`, supporting both
 * the array and the `{ packages }` form.
 *
 * A missing or unreadable manifest is not an error: workspaces are optional,
 * so it resolves to "no patterns" instead of throwing during config load.
 */
function readJsonWorkspacePatterns(rootDirectory: string): string[] {
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
 * Read a YAML scalar, dropping surrounding quotes and any trailing comment.
 */
function parseScalar(value: string): string {
	const trimmed = value.trim();
	const comment = trimmed.indexOf(' #');
	const withoutComment = (comment === -1 ? trimmed : trimmed.slice(0, comment)).trim();
	const quoted = /^(?:'|")(?<value>.*?)(?:'|")$/u.exec(withoutComment);

	return quoted?.groups?.['value'] ?? withoutComment;
}

/**
 * Read an inline YAML sequence such as `packages: ['apps/*', 'packages/*']`.
 */
function parseInlineSequence(value: string): string[] {
	const trimmed = value.trim();

	if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
		return [];
	}

	return trimmed
		.slice(1, -1)
		.split(',')
		.map(item => parseScalar(item))
		.filter(item => item.length > 0);
}

/**
 * Read the `packages:` patterns from `pnpm-workspace.yaml`.
 *
 * Only the subset pnpm documents for workspace globs is supported: the block
 * sequence under `packages:` or its inline form, with optional quotes. Every
 * other key is ignored, so catalogs and settings do not interfere.
 */
function readPnpmWorkspacePatterns(rootDirectory: string): string[] {
	const file = path.join(rootDirectory, PNPM_WORKSPACE_FILE);

	if (!existsSync(file)) {
		return [];
	}

	const patterns: string[] = [];
	let isInPackages = false;

	for (const rawLine of readFileSync(file, 'utf8').split('\n')) {
		const line = rawLine.replace(/\r$/u, '');
		const trimmed = line.trim();

		if (trimmed.length === 0 || trimmed.startsWith('#')) {
			continue;
		}

		if (!/^\s/u.test(line) && !trimmed.startsWith('-')) {
			isInPackages = trimmed.startsWith(PNPM_PACKAGES_KEY);

			if (isInPackages) {
				patterns.push(...parseInlineSequence(trimmed.slice(PNPM_PACKAGES_KEY.length)));
			}

			continue;
		}

		if (!isInPackages) {
			continue;
		}

		const item = parseScalar(trimmed.startsWith('-') ? trimmed.slice(1) : trimmed);

		if (item.length > 0) {
			patterns.push(item);
		}
	}

	return patterns;
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
 * matched by `package.json#workspaces` or `pnpm-workspace.yaml`.
 *
 * Nested patterns, `**` and negations (a pattern prefixed with `!`) are
 * supported. Negations remove an already matched package, so a pattern list
 * can exclude part of the workspace. Used to detect dependencies and tsconfigs
 * that live in a child package instead of the repository root.
 */
export default function getWorkspaceDirectories(rootDirectory: string = process.cwd()): string[] {
	const root = path.resolve(rootDirectory);
	const directories = new Set<string>([root]);
	const patterns = [...readJsonWorkspacePatterns(root), ...readPnpmWorkspacePatterns(root)];

	for (const pattern of patterns) {
		applyPattern(directories, root, pattern);
	}

	return [...directories];
}
