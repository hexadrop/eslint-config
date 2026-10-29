import { describe, expect, test } from 'bun:test';

import coreFactory, {
	CORE_CONFIG_NAME_RULES,
	CORE_CONFIG_NAME_RULES_MARKDOWN_SOURCE,
	CORE_CONFIG_NAME_RULES_NODE,
	CORE_CONFIG_NAME_SETUP,
	GLOB_MARKDOWN_SOURCE,
	IGNORE_CONFIG_NAME_ADDITIONAL,
	IGNORE_CONFIG_NAME_DEFAULT,
	IMPORTS_CONFIG_NAME_RULES_ASTRO,
	IMPORTS_CONFIG_NAME_RULES_STATIC,
	IMPORTS_CONFIG_NAME_RULES_STYLISTIC,
	IMPORTS_CONFIG_NAME_RULES_TYPESCRIPT,
	IMPORTS_CONFIG_NAME_RULES_WARNINGS,
	IMPORTS_CONFIG_NAME_SETUP,
	IMPORTS_CONFIG_NAME_SETUP_TYPESCRIPT,
} from '../src';

const ALL_OFF = {
	astro: false,
	ignore: false,
	imports: false,
	json: false,
	markdown: false,
	node: false,
	stylistic: false,
	typescript: false,
} as const;

describe('core factory', () => {
	test('emits the base setup and rules when every optional section is disabled', async () => {
		const configs = await coreFactory(ALL_OFF);
		const setup = configs.find(config => config.name === CORE_CONFIG_NAME_SETUP);
		const rules = configs.find(config => config.name === CORE_CONFIG_NAME_RULES);

		expect(setup).toBeDefined();
		expect(rules?.rules?.['eqeqeq']).toBe('error');
		expect(rules?.rules?.['no-console']).toEqual(['error', { allow: ['error'] }]);
		expect(configs.some(config => config.name === CORE_CONFIG_NAME_RULES_NODE)).toBe(false);
		expect(configs.some(config => config.name === CORE_CONFIG_NAME_RULES_MARKDOWN_SOURCE)).toBe(false);
	});

	test('adds the node plugin and rules when node is enabled', async () => {
		const configs = await coreFactory({ ...ALL_OFF, node: true });
		const setup = configs.find(config => config.name === CORE_CONFIG_NAME_SETUP);
		const node = configs.find(config => config.name === CORE_CONFIG_NAME_RULES_NODE);

		expect(setup?.plugins?.['node']).toBeDefined();
		expect(node?.rules?.['node/no-exports-assign']).toBe('error');
	});

	test('adds the markdown source overrides when markdown is enabled', async () => {
		const configs = await coreFactory({ ...ALL_OFF, markdown: true });
		const markdown = configs.find(config => config.name === CORE_CONFIG_NAME_RULES_MARKDOWN_SOURCE);

		expect(markdown?.files).toEqual(GLOB_MARKDOWN_SOURCE);
		expect(markdown?.rules?.['no-console']).toBe('off');
		expect(markdown?.rules?.['no-inline-comments']).toBe('off');
	});

	test('adds the default and additional ignore configs without reading .gitignore when globs are given', async () => {
		const configs = await coreFactory({ ...ALL_OFF, ignore: { globs: ['fixtures/**'] } });
		const defaultIgnores = configs.find(config => config.name === IGNORE_CONFIG_NAME_DEFAULT);
		const additionalIgnores = configs.find(config => config.name === IGNORE_CONFIG_NAME_ADDITIONAL);

		expect(defaultIgnores?.ignores).toContain('**/node_modules');
		expect(additionalIgnores?.ignores).toEqual(['fixtures/**']);
	});

	test('returns no ignore configs when ignore is disabled', async () => {
		const configs = await coreFactory({ ...ALL_OFF, ignore: false });

		expect(configs.some(config => config.name?.startsWith('hexadrop/ignore'))).toBe(false);
	});

	test('adds the import setup and warnings when imports is enabled', async () => {
		const configs = await coreFactory({ ...ALL_OFF, imports: true });
		const setup = configs.find(config => config.name === IMPORTS_CONFIG_NAME_SETUP);
		const warnings = configs.find(config => config.name === IMPORTS_CONFIG_NAME_RULES_WARNINGS);
		const staticRules = configs.find(config => config.name === IMPORTS_CONFIG_NAME_RULES_STATIC);

		expect(setup?.plugins?.['import']).toBeDefined();
		expect(warnings?.rules?.['import/no-extraneous-dependencies']).toBe('error');
		expect(staticRules?.rules?.['import/no-unresolved']).toBeDefined();
		expect(staticRules?.rules?.['import/no-webpack-loader-syntax']).toBe('error');
	});

	test('adds the typescript, astro and stylistic import slices when their flags are enabled', async () => {
		const configs = await coreFactory({
			...ALL_OFF,
			astro: true,
			imports: true,
			stylistic: true,
			typescript: true,
		});

		expect(configs.some(config => config.name === IMPORTS_CONFIG_NAME_SETUP_TYPESCRIPT)).toBe(true);
		expect(configs.some(config => config.name === IMPORTS_CONFIG_NAME_RULES_TYPESCRIPT)).toBe(true);
		expect(configs.some(config => config.name === IMPORTS_CONFIG_NAME_RULES_ASTRO)).toBe(true);
		expect(configs.some(config => config.name === IMPORTS_CONFIG_NAME_RULES_STYLISTIC)).toBe(true);
	});

	test('honours the module flags for dynamic require and webpack syntax', async () => {
		const commonjs = await coreFactory({ ...ALL_OFF, imports: true, module: { commonjs: true } });
		const webpack = await coreFactory({ ...ALL_OFF, imports: true, module: { webpack: true } });

		expect(
			commonjs.find(config => config.name === IMPORTS_CONFIG_NAME_RULES_STATIC)?.rules?.[
				'import/no-dynamic-require'
			]
		).toBe('error');
		expect(
			webpack.find(config => config.name === IMPORTS_CONFIG_NAME_RULES_STATIC)?.rules?.[
				'import/no-webpack-loader-syntax'
			]
		).toBeUndefined();
	});

	test('mixes an inline flat config item into the first argument', async () => {
		const configs = await coreFactory({
			...ALL_OFF,
			name: 'consumer/inline',
			rules: { eqeqeq: 'off' },
		});
		const inline = configs.find(config => config.name === 'consumer/inline');

		expect(inline?.rules?.['eqeqeq']).toBe('off');
	});

	test('appends consumer configs after the internal pipeline', async () => {
		const configs = await coreFactory({ ...ALL_OFF }, { name: 'consumer/override', rules: { eqeqeq: 'off' } });

		expect(configs.at(-1)?.name).toBe('consumer/override');
	});
});
