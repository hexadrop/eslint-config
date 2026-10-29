import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

interface TsconfigReference {
	path: string;
}

interface TsconfigShape {
	files?: string[];
	include?: string[];
	references?: TsconfigReference[];
}

/**
 * Remove JSONC comments and trailing commas so a regular `JSON.parse` can read
 * a tsconfig. The scanner keeps string contents untouched, so URLs such as
 * `https://` in string values are not mistaken for comments.
 */
function stripJsonComments(source: string): string {
	let result = '';
	let isEscaped = false;
	let isInBlockComment = false;
	let isInLineComment = false;
	let isInString = false;

	for (let index = 0; index < source.length; index++) {
		const character = source.charAt(index);

		if (isInLineComment) {
			if (character === '\n') {
				isInLineComment = false;
				result += character;
			}

			continue;
		}

		if (isInBlockComment) {
			if (character === '*' && source.charAt(index + 1) === '/') {
				isInBlockComment = false;
				index++;
			}

			continue;
		}

		if (isInString) {
			result += character;

			if (isEscaped) {
				isEscaped = false;
			} else if (character === '\\') {
				isEscaped = true;
			} else if (character === '"') {
				isInString = false;
			}

			continue;
		}

		if (character === '"') {
			isInString = true;
			result += character;
			continue;
		}

		if (character === '/' && source.charAt(index + 1) === '/') {
			isInLineComment = true;
			index++;
			continue;
		}

		if (character === '/' && source.charAt(index + 1) === '*') {
			isInBlockComment = true;
			index++;
			continue;
		}

		result += character;
	}

	return result.replaceAll(/,(?<closing>\s*[}\]])/g, '$<closing>');
}

function readTsconfig(file: string): TsconfigShape | undefined {
	try {
		return JSON.parse(stripJsonComments(readFileSync(file, 'utf8'))) as TsconfigShape;
	} catch {
		return undefined;
	}
}

function isFile(file: string): boolean {
	return existsSync(file) && file.endsWith('.json');
}

/**
 * Resolve a `references[].path` value (a directory or a tsconfig file) to an
 * existing tsconfig file.
 */
function resolveReference(reference: string, baseDirectory: string): string | undefined {
	const absolute = path.isAbsolute(reference) ? reference : path.resolve(baseDirectory, reference);
	const candidates = [absolute, `${absolute}.json`, path.join(absolute, 'tsconfig.json')];

	return candidates.find(candidate => isFile(candidate));
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
 * are removed. Non-solution projects and unreadable configs are returned as
 * given, so the previous behavior is preserved when a project cannot be
 * expanded.
 */
export function expandTsconfigProjects(projects: string[], rootDirectory: string): string[] {
	const expanded: string[] = [];
	const seen = new Set<string>();

	function visit(project: string, stack: Set<string>): void {
		const absolute = path.isAbsolute(project) ? project : path.resolve(rootDirectory, project);
		const configPath = [absolute, `${absolute}.json`, path.join(absolute, 'tsconfig.json')].find(candidate =>
			isFile(candidate)
		);

		if (!configPath || stack.has(configPath)) {
			return;
		}

		const config = readTsconfig(configPath);

		if (!config) {
			return;
		}

		if (isSolutionTsconfig(config)) {
			stack.add(configPath);
			const references = config.references ?? [];

			for (const reference of references) {
				const target = resolveReference(reference.path, path.dirname(configPath));

				if (target) {
					visit(target, stack);
				}
			}

			stack.delete(configPath);

			return;
		}

		if (!seen.has(configPath)) {
			seen.add(configPath);
			expanded.push(configPath);
		}
	}

	for (const project of projects) {
		visit(project, new Set());
	}

	return expanded.length > 0 ? expanded : projects;
}

export type { TsconfigReference, TsconfigShape };
