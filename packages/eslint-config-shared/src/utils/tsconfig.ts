import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import stripJsonc from './jsonc';

interface TsconfigReference {
	path: string;
}

interface TsconfigShape {
	files?: string[];
	include?: string[];
	references?: TsconfigReference[];
}

function readTsconfig(file: string): TsconfigShape | undefined {
	try {
		return JSON.parse(stripJsonc(readFileSync(file, 'utf8'))) as TsconfigShape;
	} catch {
		return undefined;
	}
}

function isJsonFile(file: string): boolean {
	return existsSync(file) && file.endsWith('.json');
}

/**
 * Resolve a tsconfig reference — a directory or a tsconfig file — to an
 * existing tsconfig file.
 */
function resolveTsconfigFile(reference: string, baseDirectory: string): string | undefined {
	const absolute = path.isAbsolute(reference) ? reference : path.resolve(baseDirectory, reference);
	const candidates = [absolute, `${absolute}.json`, path.join(absolute, 'tsconfig.json')];

	return candidates.find(candidate => isJsonFile(candidate));
}

function appendUnique(target: string[], seen: Set<string>, files: string[]): void {
	for (const file of files) {
		if (seen.has(file)) {
			continue;
		}

		seen.add(file);
		target.push(file);
	}
}

function isSolutionTsconfig(config: TsconfigShape): boolean {
	return (
		Boolean(config.references?.length) && (config.files?.length ?? 0) === 0 && (config.include?.length ?? 0) === 0
	);
}

/**
 * Expand solution-style tsconfigs (`files: []` plus `references`) into the
 * concrete projects typescript-eslint can lint against.
 *
 * References are followed recursively, cycles are cut and duplicate projects
 * are removed. The expanded references are absolute paths, resolved from the
 * config that declares them. Entries that cannot be expanded — non-solution
 * configs, glob patterns, missing or unreadable files — are returned exactly as
 * given, so the previous behavior is preserved for them.
 */
export function expandTsconfigProjects(projects: string[], rootDirectory: string): string[] {
	const expanded: string[] = [];
	const seen = new Set<string>();

	function resolve(project: string, stack: Set<string>): string[] | undefined {
		const configPath = resolveTsconfigFile(project, rootDirectory);

		if (!configPath || stack.has(configPath)) {
			return undefined;
		}

		const config = readTsconfig(configPath);

		if (!config) {
			return undefined;
		}

		if (!isSolutionTsconfig(config)) {
			return [project];
		}

		stack.add(configPath);
		const references = config.references ?? [];
		const resolved: string[] = [];

		for (const reference of references) {
			const target = resolveTsconfigFile(reference.path, path.dirname(configPath));
			const nested = target ? resolve(target, stack) : undefined;

			if (nested) {
				resolved.push(...nested);
			}
		}

		stack.delete(configPath);

		return resolved.length > 0 ? resolved : undefined;
	}

	for (const project of projects) {
		const resolved = resolve(project, new Set());

		if (!resolved) {
			expanded.push(project);
			continue;
		}

		appendUnique(expanded, seen, resolved);
	}

	return expanded;
}

export type { TsconfigReference, TsconfigShape };
