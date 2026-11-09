import { describe, expect, test } from 'bun:test';

import yaml from '../src';

const SETUP = 'hexadrop/yaml/setup';
const SETUP_LANGUAGE = 'hexadrop/yaml/setup/language';
const RULES = 'hexadrop/yaml/rules';
const YAML_GLOBS = ['**/*.yml', '**/*.yaml'];
const MARKDOWN_YAML_GLOBS = ['**/*.md/**/*.yml', '**/*.md/**/*.yaml'];

describe('yaml config', () => {
	test('returns an array with at least the internal slice entries', async () => {
		const configs = await yaml();

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBeGreaterThanOrEqual(3);
	});

	test('emits the yaml config names', async () => {
		const configs = await yaml();
		const names = configs.map(config => config.name);

		expect(names).toContain(SETUP);
		expect(names).toContain(SETUP_LANGUAGE);
		expect(names).toContain(RULES);
	});

	test('registers the yml plugin under the `yaml` prefix', async () => {
		const configs = await yaml();
		const setup = configs.find(config => config.name === SETUP);

		expect(setup?.plugins?.['yaml']).toBeDefined();
		expect(setup?.plugins?.['yml']).toBeUndefined();
	});

	test('wires the yaml language and rules to the yaml and markdown globs', async () => {
		const configs = await yaml();
		const language = configs.find(config => config.name === SETUP_LANGUAGE);
		const rules = configs.find(config => config.name === RULES);
		const files = [...YAML_GLOBS, ...MARKDOWN_YAML_GLOBS];

		expect(language?.files).toEqual(files);
		expect(language?.language).toBe('yaml/yaml');
		expect(rules?.files).toEqual(files);
	});

	test('applies the standard conventions with the repository overrides', async () => {
		const configs = await yaml();
		const rules = configs.find(config => config.name === RULES)?.rules;

		expect(rules?.['yaml/indent']).toEqual(['error', 2]);
		expect(rules?.['yaml/quotes']).toEqual(['error', { avoidEscape: false, prefer: 'single' }]);
		expect(rules?.['yaml/sort-keys']).toBe('off');
		expect(rules?.['yaml/no-tab-indent']).toBe('error');
		expect(rules?.['yaml/no-empty-key']).toBe('error');
		expect(rules?.['yml/no-empty-key']).toBeUndefined();
	});

	test('snapshot: full config structure', async () => {
		const configs = await yaml();
		const sanitised = configs.map(({ language, plugins, ...rest }) => ({
			...rest,
			language,
			plugins: plugins ? Object.keys(plugins) : undefined,
		}));

		expect(sanitised).toMatchSnapshot('yaml-full-config');
	});

	test('appends an inline config item', async () => {
		const configs = await yaml({ name: 'consumer/inline', rules: { 'yaml/no-empty-key': 'off' } });
		const inline = configs.find(config => config.name === 'consumer/inline');

		expect(inline?.rules?.['yaml/no-empty-key']).toBe('off');
	});

	test('appends consumer configs after the internal slice', async () => {
		const configs = await yaml({}, { name: 'consumer/override', rules: { 'yaml/no-empty-key': 'off' } });

		expect(configs.at(-1)?.name).toBe('consumer/override');
	});
});
