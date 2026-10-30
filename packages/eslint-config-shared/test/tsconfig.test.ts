import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, test } from 'bun:test';

import { expandTsconfigProjects } from '../src';

/**
 * Materialise a throwaway directory holding the given tsconfig files, run the
 * assertions against it and remove it afterwards.
 */
function withProject(files: Record<string, unknown>, run: (directory: string) => void): void {
	const directory = mkdtempSync(path.join(tmpdir(), 'hexadrop-tsconfig-'));

	try {
		for (const [relativePath, content] of Object.entries(files)) {
			const file = path.join(directory, relativePath);

			mkdirSync(path.dirname(file), { recursive: true });
			writeFileSync(file, typeof content === 'string' ? content : JSON.stringify(content));
		}

		run(directory);
	} finally {
		rmSync(directory, { force: true, recursive: true });
	}
}

describe('expandTsconfigProjects', () => {
	test('expands a solution root into its referenced projects', () => {
		withProject(
			{
				'app/tsconfig.json': { include: ['src'] },
				'tools.tsconfig.json': { include: ['*.ts'] },
				'tsconfig.json': { files: [], references: [{ path: './app' }, { path: './tools.tsconfig.json' }] },
			},
			directory => {
				expect(expandTsconfigProjects(['tsconfig.json'], directory)).toEqual([
					path.join(directory, 'app', 'tsconfig.json'),
					path.join(directory, 'tools.tsconfig.json'),
				]);
			}
		);
	});

	test('accepts comments and trailing commas in the solution config', () => {
		withProject(
			{
				'app/tsconfig.json': { include: ['src'] },
				'tsconfig.json': '{\n\t// solution root\n\t"files": [],\n\t"references": [{ "path": "./app" },],\n}',
			},
			directory => {
				expect(expandTsconfigProjects(['tsconfig.json'], directory)).toEqual([
					path.join(directory, 'app', 'tsconfig.json'),
				]);
			}
		);
	});

	test('removes duplicate projects', () => {
		withProject(
			{
				'app/tsconfig.json': { include: ['src'] },
				'tsconfig.json': { files: [], references: [{ path: './app' }, { path: './app/tsconfig.json' }] },
			},
			directory => {
				expect(expandTsconfigProjects(['tsconfig.json', 'tsconfig.json'], directory)).toEqual([
					path.join(directory, 'app', 'tsconfig.json'),
				]);
			}
		);
	});

	test('cuts a reference cycle between two solution configs', () => {
		withProject(
			{
				'a/tsconfig.json': { files: [], references: [{ path: '../b' }] },
				'b/tsconfig.json': { files: [], references: [{ path: '../a' }] },
			},
			directory => {
				expect(expandTsconfigProjects(['a'], directory)).toEqual(['a']);
			}
		);
	});

	test('keeps a non-solution or missing project exactly as given', () => {
		withProject({ 'tsconfig.json': { include: ['src'] } }, directory => {
			expect(expandTsconfigProjects(['tsconfig.json'], directory)).toEqual(['tsconfig.json']);
			expect(expandTsconfigProjects(['./missing/tsconfig.json'], directory)).toEqual(['./missing/tsconfig.json']);
		});
	});

	test('keeps glob patterns that sit next to an expandable project', () => {
		withProject(
			{
				'app/tsconfig.json': { include: ['src'] },
				'tsconfig.json': { files: [], references: [{ path: './app' }] },
			},
			directory => {
				expect(expandTsconfigProjects(['./packages/*/tsconfig.json', 'tsconfig.json'], directory)).toEqual([
					'./packages/*/tsconfig.json',
					path.join(directory, 'app', 'tsconfig.json'),
				]);
			}
		);
	});

	test('keeps the solution root when none of its references can be read', () => {
		withProject({ 'tsconfig.json': { files: [], references: [{ path: './missing' }] } }, directory => {
			expect(expandTsconfigProjects(['tsconfig.json'], directory)).toEqual(['tsconfig.json']);
		});
	});

	test('leaves an empty project list empty', () => {
		withProject({}, directory => {
			expect(expandTsconfigProjects([], directory)).toEqual([]);
		});
	});
});
