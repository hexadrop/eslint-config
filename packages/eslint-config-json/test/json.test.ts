import { describe, expect, test } from 'bun:test';

import json, {
	GLOB_JSON,
	GLOB_JSON_PACKAGE,
	GLOB_JSON_TSCONFIG,
	JSON_CONFIG_NAME_RULES,
	JSON_CONFIG_NAME_SETUP,
	JSON_CONFIG_NAME_SETUP_PARSER,
	JSON_SORT_KEYS_CONFIG,
	STYLISTIC_CONFIG_NAME_RULES_JSON_PACKAGE,
	STYLISTIC_CONFIG_NAME_RULES_JSON_TSCONFIG,
} from '../src';

describe('json factory', () => {
	test('returns a thenable composer resolving to the json config slice', async () => {
		const configs = await json();

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBeGreaterThanOrEqual(3);
	});

	test('emits the setup, parser and rules config names', async () => {
		const configs = await json();
		const names = configs.map(config => config.name);

		expect(names).toContain(JSON_CONFIG_NAME_SETUP);
		expect(names).toContain(JSON_CONFIG_NAME_SETUP_PARSER);
		expect(names).toContain(JSON_CONFIG_NAME_RULES);
	});

	test('registers the jsonc plugin under the renamed `json` prefix', async () => {
		const configs = await json();
		const setup = configs.find(config => config.name === JSON_CONFIG_NAME_SETUP);

		expect(setup?.plugins?.['json']).toBeDefined();
	});

	test('applies the jsonc parser and rules to the json globs', async () => {
		const configs = await json();
		const parser = configs.find(config => config.name === JSON_CONFIG_NAME_SETUP_PARSER);
		const rules = configs.find(config => config.name === JSON_CONFIG_NAME_RULES);

		expect(parser?.files).toEqual(GLOB_JSON);
		expect(parser?.languageOptions?.['parser']).toBeDefined();
		expect(rules?.files).toEqual(GLOB_JSON);
	});

	test('pins the json rule states the meta-package ships today', async () => {
		const configs = await json();
		const rules = configs.find(config => config.name === JSON_CONFIG_NAME_RULES)?.rules ?? {};

		for (const rule of [
			'json/no-bigint-literals',
			'json/no-dupe-keys',
			'json/no-nan',
			'json/no-octal',
			'json/no-sparse-arrays',
			'json/no-template-literals',
			'json/no-undefined-value',
			'json/valid-json-number',
			'json/vue-custom-block/no-parsing-error',
		]) {
			expect(rules[rule]).toBe('error');
		}
	});

	test('disabling the json option resolves to an empty pipeline', async () => {
		const configs = await json({ json: false });

		expect(configs).toEqual([]);
	});

	test('appends consumer configs after the json slice', async () => {
		const configs = await json({ json: true }, { name: 'consumer/override', rules: { 'json/no-nan': 'off' } });

		expect(configs.at(-1)?.name).toBe('consumer/override');
	});
});

describe('json sort-keys configs', () => {
	test('exposes the package.json and tsconfig.json ordering configs', () => {
		const names = JSON_SORT_KEYS_CONFIG.map(config => config.name);

		expect(names).toEqual([STYLISTIC_CONFIG_NAME_RULES_JSON_PACKAGE, STYLISTIC_CONFIG_NAME_RULES_JSON_TSCONFIG]);
	});

	test('targets the package.json and tsconfig globs', () => {
		const [packageConfig, tsconfigConfig] = JSON_SORT_KEYS_CONFIG;

		expect(packageConfig?.files).toEqual(GLOB_JSON_PACKAGE);
		expect(tsconfigConfig?.files).toEqual(GLOB_JSON_TSCONFIG);
	});

	test('orders package.json keys canonically', () => {
		const sortKeys = JSON_SORT_KEYS_CONFIG[0]?.rules?.['json/sort-keys'];

		expect(Array.isArray(sortKeys)).toBe(true);
		const [, root] = sortKeys as [string, { order: string[]; pathPattern: string }, ...unknown[]];

		expect(root.pathPattern).toBe('^$');
		expect(root.order[0]).toBe('name');
		expect(root.order).toContain('dependencies');
	});

	test('orders tsconfig compilerOptions canonically', () => {
		const sortKeys = JSON_SORT_KEYS_CONFIG[1]?.rules?.['json/sort-keys'];

		expect(Array.isArray(sortKeys)).toBe(true);
		const entries = (sortKeys as [string, ...{ order?: string[]; pathPattern?: string }[]]).slice(1);
		const [first] = entries;

		expect(first && typeof first === 'object' ? first.order : undefined).toEqual([
			'extends',
			'compilerOptions',
			'references',
			'files',
			'include',
			'exclude',
		]);
		expect(entries.some(entry => typeof entry === 'object' && entry.pathPattern === '^compilerOptions$')).toBe(
			true
		);
	});
});
