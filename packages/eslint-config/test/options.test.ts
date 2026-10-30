import { existsSync } from 'node:fs';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';

import hexadrop from '../src';
import defaultOptions from '../src/options/hexadrop-eslint.options';

/*
 * Other suites replace `local-pkg` globally, so this file pins its own view of
 * the installed packages to keep the assertions independent of test order.
 */
function mockTypescriptInstalled() {
	void mock.module('local-pkg', () => ({
		getPackageInfoSync: () => ({}),
		isPackageExists: (name: string) => name === 'typescript',
	}));
}

beforeEach(mockTypescriptInstalled);
afterEach(() => {
	mock.restore();
});

describe('typescript option resolution', () => {
	test('keeps typescript: true non-type-aware', () => {
		const options = defaultOptions({ typescript: true });

		expect(options.typescript).toBe(true);
	});

	test('detects the root tsconfig when typescript is left empty', () => {
		const options = defaultOptions({});
		const expected = existsSync(path.resolve('tsconfig.json')) ? 'tsconfig.json' : true;

		expect(options.typescript).toEqual({ project: expected });
	});

	test('keeps a string tsconfig path instead of disabling typescript', () => {
		const options = defaultOptions({ typescript: './tsconfig.json' });

		expect(options.typescript).toEqual({ project: './tsconfig.json' });
	});

	test('keeps an array of tsconfig paths', () => {
		const options = defaultOptions({ typescript: ['./tsconfig.json', './tsconfig.tools.json'] });

		expect(options.typescript).toEqual({ project: ['./tsconfig.json', './tsconfig.tools.json'] });
	});

	test('keeps an explicit string tsconfig when typescript is not detected', () => {
		void mock.module('local-pkg', () => ({
			getPackageInfoSync: () => ({}),
			isPackageExists: () => false,
		}));

		const options = defaultOptions({ typescript: './tsconfig.json' });

		expect(options.typescript).toEqual({ project: './tsconfig.json' });
	});

	test('keeps the object form including tsconfigRootDir', () => {
		const options = defaultOptions({
			typescript: { project: './tsconfig.json', tsconfigRootDir: '/repository' },
		});

		expect(options.typescript).toEqual({ project: './tsconfig.json', tsconfigRootDir: '/repository' });
	});

	test('forwards parserOptions and resolver from the object form', () => {
		const options = defaultOptions({
			typescript: {
				parserOptions: { projectService: true },
				project: './tsconfig.json',
				resolver: { bun: true },
				tsconfigRootDir: '/repository',
			},
		});

		expect(options.typescript).toEqual({
			parserOptions: { projectService: true },
			project: './tsconfig.json',
			resolver: { bun: true },
			tsconfigRootDir: '/repository',
		});
	});

	test('enables type-aware linting with projectService and no project', async () => {
		const configs = await hexadrop({
			astro: false,
			react: false,
			typescript: { parserOptions: { projectService: true } },
		});
		const names = configs.map(config => config.name);

		expect(names).toContain('hexadrop/typescript/setup/parser/type-aware');
		expect(names).toContain('hexadrop/typescript/rules/type-aware');
	});

	test('emits the type-aware parser and rules for a string tsconfig', async () => {
		const configs = await hexadrop({ astro: false, react: false, typescript: './tsconfig.json' });
		const names = configs.map(config => config.name);

		expect(names).toContain('hexadrop/typescript/setup/parser/type-aware');
		expect(names).toContain('hexadrop/typescript/rules/type-aware');
	});
});
