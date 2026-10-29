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
 * Expand a workspace pattern into directories. Only exact paths and a trailing
 * `*` segment are supported (`packages/*`, `apps/*`, `ha-finassists`), which is
 * what npm, pnpm, Bun and Yarn workspaces use in practice.
 */
function expandPattern(rootDirectory: string, pattern: string): string[] {
	const cleaned = pattern.replace(/^\.\//, '').replace(/\/+$/, '');

	if (!cleaned.includes('*')) {
		return [path.resolve(rootDirectory, cleaned)];
	}

	const segments = cleaned.split('/').filter(Boolean);
	const lastSegment = segments.at(-1);

	if (lastSegment !== '*') {
		return [];
	}

	const base = path.resolve(rootDirectory, ...segments.slice(0, -1));

	if (!existsSync(base)) {
		return [];
	}

	return readdirSync(base, { withFileTypes: true })
		.filter(entry => entry.isDirectory() && !IGNORED_DIRECTORIES.has(entry.name))
		.map(entry => path.join(base, entry.name));
}

/**
 * List the directories of a workspace: the root plus every directory matched by
 * `package.json#workspaces`. Used to detect dependencies and tsconfigs that live
 * in a child package instead of the repository root.
 */
export default function getWorkspaceDirectories(rootDirectory: string = process.cwd()): string[] {
	const directories = new Set<string>([path.resolve(rootDirectory)]);

	for (const pattern of readWorkspacePatterns(rootDirectory)) {
		for (const directory of expandPattern(rootDirectory, pattern)) {
			if (existsSync(directory)) {
				directories.add(directory);
			}
		}
	}

	return [...directories];
}
