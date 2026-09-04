import { describe, expect, test } from 'bun:test';

import json, { JSON_SORT_KEYS_CONFIG } from '../src';

const SETUP = 'hexadrop/json/setup';
const SETUP_PARSER = 'hexadrop/json/setup/parser';
const RULES = 'hexadrop/json/rules';
const JSON_GLOBS = ['**/*.json', '**/*.json5', '**/*.jsonc'];

describe('json config', () => {
	test('returns an array with at least the internal slice entries', async () => {
		const configs = await json();

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBeGreaterThanOrEqual(3);
	});

	test('emits the json config names', async () => {
		const configs = await json();
		const names = configs.map(config => config.name);

		expect(names).toContain(SETUP);
		expect(names).toContain(SETUP_PARSER);
		expect(names).toContain(RULES);
	});

	test('registers the jsonc plugin under the `json` prefix', async () => {
		const configs = await json();
		const setup = configs.find(config => config.name === SETUP);

		expect(setup?.plugins?.['json']).toBeDefined();
	});

	test('wires the jsonc parser and rules to the json globs', async () => {
		const configs = await json();
		const parser = configs.find(config => config.name === SETUP_PARSER);
		const rules = configs.find(config => config.name === RULES);

		expect(parser?.files).toEqual(JSON_GLOBS);
		expect(parser?.languageOptions?.['parser']).toBeDefined();
		expect(rules?.files).toEqual(JSON_GLOBS);
	});

	test('exports sort-keys configs matching snapshot', () => {
		expect(JSON_SORT_KEYS_CONFIG).toMatchSnapshot('json-sort-keys');
	});

	test('snapshot: full config structure', async () => {
		const configs = await json();
		const sanitised = configs.map(({ languageOptions, plugins, ...rest }) => ({
			...rest,
			languageOptions: languageOptions
				? { parser: languageOptions['parser'] ? '<parser>' : undefined }
				: undefined,
			plugins: plugins ? Object.keys(plugins) : undefined,
		}));

		expect(sanitised).toMatchSnapshot('json-full-config');
	});

	test('mixes an inline config item into the first argument', async () => {
		const configs = await json({ name: 'consumer/inline', rules: { 'json/no-nan': 'off' } });
		const inline = configs.find(config => config.name === 'consumer/inline');

		expect(inline?.rules?.['json/no-nan']).toBe('off');
	});

	test('appends consumer configs after the internal slice', async () => {
		const configs = await json({}, { name: 'consumer/override', rules: { 'json/no-nan': 'off' } });

		expect(configs.at(-1)?.name).toBe('consumer/override');
	});
});
