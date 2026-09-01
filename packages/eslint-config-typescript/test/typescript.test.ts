import { describe, expect, test } from 'bun:test';

import typescript, {
	DTS_GLOBS,
	SOURCE_GLOBS,
	TEST_GLOBS,
	TYPESCRIPT_CONFIG_NAME_RULES,
	TYPESCRIPT_CONFIG_NAME_RULES_DTS,
	TYPESCRIPT_CONFIG_NAME_RULES_TEST,
	TYPESCRIPT_CONFIG_NAME_RULES_TYPEAWARE,
	TYPESCRIPT_CONFIG_NAME_SETUP,
	TYPESCRIPT_CONFIG_NAME_SETUP_PARSER,
	TYPESCRIPT_CONFIG_NAME_SETUP_PARSER_TYPEAWARE,
} from '../src';

describe('typescript config', () => {
	test('when typescript is false, resolves to an empty pipeline', async () => {
		const configs = await typescript({ typescript: false });

		expect(configs).toEqual([]);
	});

	test('when typescript is true, emits the setup, parser, rules, dts and test config names', async () => {
		const configs = await typescript({ typescript: true });
		const names = configs.map(config => config.name);

		expect(names).toContain(TYPESCRIPT_CONFIG_NAME_SETUP);
		expect(names).toContain(TYPESCRIPT_CONFIG_NAME_SETUP_PARSER);
		expect(names).toContain(TYPESCRIPT_CONFIG_NAME_RULES);
		expect(names).toContain(TYPESCRIPT_CONFIG_NAME_RULES_DTS);
		expect(names).toContain(TYPESCRIPT_CONFIG_NAME_RULES_TEST);
	});

	test('when typescript is true, registers the typescript plugin', async () => {
		const configs = await typescript({ typescript: true });
		const setup = configs.find(config => config.name === TYPESCRIPT_CONFIG_NAME_SETUP);

		expect(setup?.plugins?.['typescript']).toBeDefined();
	});

	test('when typescript is true, attaches the parser to source files', async () => {
		const configs = await typescript({ typescript: true });
		const parser = configs.find(config => config.name === TYPESCRIPT_CONFIG_NAME_SETUP_PARSER);

		expect(parser?.files).toEqual(SOURCE_GLOBS);
		expect(parser?.languageOptions?.['parser']).toBeDefined();
	});

	test('basic rules target source files', async () => {
		const configs = await typescript({ typescript: true });
		const rules = configs.find(config => config.name === TYPESCRIPT_CONFIG_NAME_RULES);

		expect(rules?.files).toEqual(SOURCE_GLOBS);
		expect(rules?.rules?.['typescript/no-extraneous-class']).toBe('off');
		expect(rules?.rules?.['typescript/no-unused-vars']).toBe('off');
	});

	test('dts rules target dts files', async () => {
		const configs = await typescript({ typescript: true });
		const dtsRules = configs.find(config => config.name === TYPESCRIPT_CONFIG_NAME_RULES_DTS);

		expect(dtsRules?.files).toEqual(DTS_GLOBS);
		expect(dtsRules?.rules?.['typescript/triple-slash-reference']).toBe('off');
	});

	test('test rules relax no-confusing-void-expression', async () => {
		const configs = await typescript({ typescript: true });
		const testRules = configs.find(config => config.name === TYPESCRIPT_CONFIG_NAME_RULES_TEST);

		expect(testRules?.files).toEqual(TEST_GLOBS);
		expect(testRules?.rules?.['typescript/no-confusing-void-expression']).toBe('off');
	});

	test('when typescript is true, type-aware rules are absent', async () => {
		const configs = await typescript({ typescript: true });

		expect(configs.some(config => config.name === TYPESCRIPT_CONFIG_NAME_RULES_TYPEAWARE)).toBe(false);
	});

	test('when tsconfig paths are provided, emits the type-aware parser and rules', async () => {
		const configs = await typescript({ typescript: ['tsconfig.json'] });
		const names = configs.map(config => config.name);

		expect(names).toContain(TYPESCRIPT_CONFIG_NAME_SETUP_PARSER_TYPEAWARE);
		expect(names).toContain(TYPESCRIPT_CONFIG_NAME_RULES_TYPEAWARE);
	});

	test('type-aware parser sets the tsconfig project and root dir', async () => {
		const configs = await typescript({ typescript: 'tsconfig.json' });
		const parser = configs.find(config => config.name === TYPESCRIPT_CONFIG_NAME_SETUP_PARSER_TYPEAWARE);

		expect((parser?.languageOptions as Record<string, unknown>)['parserOptions']).toHaveProperty('project', [
			'tsconfig.json',
		]);
		expect((parser?.languageOptions as Record<string, unknown>)['parserOptions']).toHaveProperty('tsconfigRootDir');
	});

	test('type-aware rules include strict-type-checked-only overrides', async () => {
		const configs = await typescript({ typescript: ['tsconfig.json'] });
		const typeAware = configs.find(config => config.name === TYPESCRIPT_CONFIG_NAME_RULES_TYPEAWARE);

		expect(typeAware?.rules?.['typescript/no-deprecated']).toBe('warn');
		expect(typeAware?.rules?.['typescript/prefer-readonly']).toEqual(['error']);
		expect(typeAware?.rules?.['typescript/switch-exhaustiveness-check']).toEqual(['error']);
	});

	test('defaults to typescript enabled when omitted', async () => {
		const configs = await typescript();
		const names = configs.map(config => config.name);

		expect(names).toContain(TYPESCRIPT_CONFIG_NAME_SETUP);
		expect(names).toContain(TYPESCRIPT_CONFIG_NAME_RULES);
	});
});

describe('typescript factory', () => {
	test('accepts a flat config item mixed into the first argument', async () => {
		const configs = await typescript({
			name: 'consumer/inline',
			rules: { 'typescript/no-extraneous-class': 'error' },
			typescript: true,
		});
		const inline = configs.find(config => config.name === 'consumer/inline');

		expect(inline?.rules?.['typescript/no-extraneous-class']).toBe('error');
	});

	test('appends consumer configs after the typescript slice', async () => {
		const configs = await typescript(
			{ typescript: true },
			{ name: 'consumer/override', rules: { 'typescript/no-explicit-any': 'error' } }
		);

		expect(configs.at(-1)?.name).toBe('consumer/override');
	});
});
