import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';

import stylisticFactory, { config } from '../src';

const SETUP = 'hexadrop/stylistic/setup';
const RULES = 'hexadrop/stylistic/rules';

const ASTRO_PKG = '@hexadrop/eslint-config-astro';
const JSON_PKG = '@hexadrop/eslint-config-json';
const TYPESCRIPT_PKG = '@hexadrop/eslint-config-typescript';

function mockInstalled(...packageNames: string[]) {
	void mock.module('local-pkg', () => ({
		isPackageExists: (name: string) => packageNames.includes(name),
	}));
}

const fullOptions = {
	astro: false,
	format: true,
	isTypeAware: true,
	json: false,
	markdown: false,
	perfectionist: true,
	stylistic: {
		arrowParens: 'avoid' as const,
		braceStyle: '1tbs' as const,
		bracketSameLine: true,
		bracketSpacing: true,
		endOfLine: 'lf' as const,
		indent: 'tab' as const,
		indentSize: 4,
		printWidth: 120,
		quoteProps: 'as-needed' as const,
		quotes: 'single' as const,
		semicolons: true,
		singleAttributePerLine: true,
		trailingComma: 'es5' as const,
	},
	typescript: true,
	unicorn: true,
};

const minimalOptions = {
	...fullOptions,
	format: false,
	perfectionist: false,
	unicorn: false,
};

/**
 * Options that leave the optional peers to auto-detection.
 */
const autoDetectOptions = {
	format: false,
	isTypeAware: true,
	markdown: false,
	perfectionist: false,
	stylistic: fullOptions.stylistic,
	unicorn: false,
};

beforeEach(() => {
	mockInstalled(ASTRO_PKG, JSON_PKG, TYPESCRIPT_PKG);
});

afterEach(() => {
	mock.restore();
});

describe('stylistic config', () => {
	test('returns a FlatConfigComposer', async () => {
		const composer = stylisticFactory(fullOptions);

		const configs = await composer;
		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBeGreaterThanOrEqual(2);
	});

	test('emits the stylistic config names', async () => {
		const configs = await config(fullOptions);
		const names = configs.map(c => c.name);

		expect(names).toContain(SETUP);
		expect(names).toContain(RULES);
	});

	test('registers the @stylistic plugin under the `style` prefix', async () => {
		const configs = await config(fullOptions);
		const setup = configs.find(c => c.name === SETUP);

		expect(setup?.plugins?.['style']).toBeDefined();
	});

	describe('concern toggles', () => {
		test('includes typescript section when typescript is enabled', async () => {
			const configs = await config({ ...minimalOptions, typescript: true });
			const names = configs.map(c => c.name);
			expect(names).toContain('hexadrop/stylistic/rules/typescript');
		});

		test('skips typescript section when typescript is disabled', async () => {
			const configs = await config({ ...minimalOptions, typescript: false });
			const names = configs.map(c => c.name);
			expect(names).not.toContain('hexadrop/stylistic/rules/typescript');
		});

		test('includes json section when json is enabled', async () => {
			const configs = await config({ ...minimalOptions, json: true });
			const names = configs.map(c => c.name);
			expect(names).toContain('hexadrop/stylistic/rules/json');
		});

		test('skips json section when json is disabled', async () => {
			const configs = await config({ ...minimalOptions, json: false });
			const names = configs.map(c => c.name);
			expect(names).not.toContain('hexadrop/stylistic/rules/json');
		});

		test('includes astro section when astro is enabled', async () => {
			const configs = await config({ ...minimalOptions, astro: true });
			const names = configs.map(c => c.name);
			expect(names).toContain('hexadrop/stylistic/rules/astro');
		});

		test('skips astro section when astro is disabled', async () => {
			const configs = await config({ ...minimalOptions, astro: false });
			const names = configs.map(c => c.name);
			expect(names).not.toContain('hexadrop/stylistic/rules/astro');
		});

		test('includes unicorn section when unicorn is enabled', async () => {
			const configs = await config({ ...minimalOptions, unicorn: true });
			const names = configs.map(c => c.name);
			expect(names).toContain('hexadrop/stylistic/rules/unicorn');
		});

		test('skips unicorn section when unicorn is disabled', async () => {
			const configs = await config(minimalOptions);
			const names = configs.map(c => c.name);
			expect(names).not.toContain('hexadrop/stylistic/rules/unicorn');
		});

		test('includes perfectionist section when perfectionist is enabled', async () => {
			const configs = await config({ ...minimalOptions, perfectionist: true });
			const names = configs.map(c => c.name);
			expect(names).toContain('hexadrop/stylistic/rules/perfectionist');
		});

		test('skips perfectionist section when perfectionist is disabled', async () => {
			const configs = await config(minimalOptions);
			const names = configs.map(c => c.name);
			expect(names).not.toContain('hexadrop/stylistic/rules/perfectionist');
		});

		test('includes format/prettier section when format is enabled', async () => {
			const configs = await config({ ...minimalOptions, format: true });
			const names = configs.map(c => c.name);
			expect(names).toContain('hexadrop/stylistic/rules/prettier');
		});

		test('skips format/prettier section when format is disabled', async () => {
			const configs = await config(minimalOptions);
			const names = configs.map(c => c.name);
			expect(names).not.toContain('hexadrop/stylistic/rules/prettier');
		});
	});

	describe('peer auto-detection', () => {
		test('enables the typescript section when its peer is installed', async () => {
			mockInstalled(TYPESCRIPT_PKG);

			const configs = await stylisticFactory(autoDetectOptions);
			const names = configs.map(c => c.name);

			expect(names).toContain('hexadrop/stylistic/rules/typescript');
		});

		test('skips the typescript section when its peer is missing', async () => {
			mockInstalled();

			const configs = await stylisticFactory(autoDetectOptions);
			const names = configs.map(c => c.name);

			expect(names).not.toContain('hexadrop/stylistic/rules/typescript');
		});

		test('enables the json section when its peer is installed', async () => {
			mockInstalled(JSON_PKG);

			const configs = await stylisticFactory(autoDetectOptions);
			const names = configs.map(c => c.name);

			expect(names).toContain('hexadrop/stylistic/rules/json');
		});

		test('skips the json section when its peer is missing', async () => {
			mockInstalled(ASTRO_PKG, TYPESCRIPT_PKG);

			const configs = await stylisticFactory(autoDetectOptions);
			const names = configs.map(c => c.name);

			expect(names).not.toContain('hexadrop/stylistic/rules/json');
		});

		test('enables the astro section when its peer is installed', async () => {
			mockInstalled(ASTRO_PKG);

			const configs = await stylisticFactory(autoDetectOptions);
			const names = configs.map(c => c.name);

			expect(names).toContain('hexadrop/stylistic/rules/astro');
		});

		test('an explicit false wins over a detected peer', async () => {
			mockInstalled(ASTRO_PKG, JSON_PKG, TYPESCRIPT_PKG);

			const configs = await stylisticFactory({
				...autoDetectOptions,
				astro: false,
				json: false,
				typescript: false,
			});
			const names = configs.map(c => c.name);

			expect(names).not.toContain('hexadrop/stylistic/rules/astro');
			expect(names).not.toContain('hexadrop/stylistic/rules/json');
			expect(names).not.toContain('hexadrop/stylistic/rules/typescript');
		});

		test.each([
			['astro', ASTRO_PKG],
			['json', JSON_PKG],
			['typescript', TYPESCRIPT_PKG],
		] as const)(
			'throws an actionable error when %s is forced but the peer is missing',
			(optionKey, packageName) => {
				mockInstalled();

				expect(() => stylisticFactory({ ...autoDetectOptions, [optionKey]: true })).toThrow(packageName);
			}
		);
	});

	test('returns empty config when stylistic is false via factory', async () => {
		const composer = stylisticFactory({ stylistic: false });
		const configs = await composer;

		expect(configs.length).toBe(0);
	});

	test('appends consumer configs after the internal slice', async () => {
		const composer = stylisticFactory(fullOptions, {
			name: 'consumer/override',
			rules: { curly: 'off' as const },
		});

		const configs = await composer;

		expect(configs.at(-1)?.name).toBe('consumer/override');
	});

	test('snapshot: full config structure', async () => {
		const configs = await config(fullOptions);
		const sanitised = configs.map(({ plugins, ...rest }) => ({
			...rest,
			plugins: plugins ? Object.keys(plugins) : undefined,
		}));

		expect(sanitised).toMatchSnapshot('stylistic-full-config');
	});
});
