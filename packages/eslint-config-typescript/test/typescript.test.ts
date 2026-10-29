import { describe, expect, test } from 'bun:test';

import typescriptFactory from '../src';

const SETUP = 'hexadrop/typescript/setup';
const SETUP_PARSER = 'hexadrop/typescript/setup/parser';
const SETUP_PARSER_TYPEAWARE = 'hexadrop/typescript/setup/parser/type-aware';
const RULES = 'hexadrop/typescript/rules';
const RULES_DTS = 'hexadrop/typescript/rules/dts';
const RULES_TYPEAWARE = 'hexadrop/typescript/rules/type-aware';
const RULES_TEST = 'hexadrop/typescript/rules/test';

describe('typescript config', () => {
	test('returns empty array when project is false', async () => {
		const configs = await typescriptFactory({ project: false });
		expect(configs).toEqual([]);
	});

	test('returns empty array when options is empty', async () => {
		const configs = await typescriptFactory();
		expect(configs).toEqual([]);
	});

	test('emits the correct config names (non-type-aware)', async () => {
		const configs = await typescriptFactory({ project: true });
		const names = configs.map(config => config.name);

		expect(names).toContain(SETUP);
		expect(names).toContain(SETUP_PARSER);
		expect(names).toContain(RULES);
		expect(names).toContain(RULES_DTS);
		expect(names).toContain(RULES_TEST);
		expect(names).not.toContain(RULES_TYPEAWARE);
		expect(names).not.toContain(SETUP_PARSER_TYPEAWARE);
	});

	test('emits the correct config names (type-aware)', async () => {
		const configs = await typescriptFactory({ project: ['tsconfig.json'] });
		const names = configs.map(config => config.name);

		expect(names).toContain(SETUP);
		expect(names).toContain(SETUP_PARSER);
		expect(names).toContain(SETUP_PARSER_TYPEAWARE);
		expect(names).toContain(RULES);
		expect(names).toContain(RULES_DTS);
		expect(names).toContain(RULES_TYPEAWARE);
		expect(names).toContain(RULES_TEST);
	});

	test('registers the typescript-eslint plugin under the `typescript` prefix', async () => {
		const configs = await typescriptFactory({ project: true });
		const setup = configs.find(config => config.name === SETUP);

		expect(setup?.plugins?.['typescript']).toBeDefined();
	});

	test('wires the parser to SOURCE_GLOBS when project is true', async () => {
		const configs = await typescriptFactory({ project: true });
		const parser = configs.find(config => config.name === SETUP_PARSER);

		expect(parser?.files?.length).toBeGreaterThan(0);
		expect(parser?.languageOptions?.['parser']).toBeDefined();
		expect(parser?.languageOptions?.['parserOptions']).toBeDefined();
	});

	test('wires type-aware parser with project and tsconfigRootDir', async () => {
		const configs = await typescriptFactory({
			project: ['tsconfig.json', 'tsconfig.build.json'],
			tsconfigRootDir: '/custom/root',
		});
		const parser = configs.find(config => config.name === SETUP_PARSER_TYPEAWARE);

		expect(parser?.files?.length).toBeGreaterThan(0);
		expect(parser?.ignores).toBeDefined();
		expect(parser?.languageOptions?.['parser']).toBeDefined();
		const parserOptions = parser?.languageOptions?.['parserOptions'] as Record<string, unknown> | undefined;
		expect(parserOptions).toBeDefined();
		expect(parserOptions?.['project']).toEqual(['tsconfig.json', 'tsconfig.build.json']);
		expect(parserOptions?.['tsconfigRootDir']).toBe('/custom/root');
	});

	test('applies eslint-recommended overrides on SOURCE_GLOBS', async () => {
		const configs = await typescriptFactory({ project: true });
		const rules = configs.find(config => config.name === RULES);

		expect(rules?.rules?.['typescript/explicit-module-boundary-types']).toEqual(['error']);
		expect(rules?.rules?.['typescript/no-extraneous-class']).toBe('off');
	});

	test('applies DTS-specific rules', async () => {
		const configs = await typescriptFactory({ project: true });
		const dts = configs.find(config => config.name === RULES_DTS);

		expect(dts?.rules?.['typescript/triple-slash-reference']).toBe('off');
	});

	test('applies type-aware rules only when project is a string', async () => {
		const configs = await typescriptFactory({ project: ['tsconfig.json'] });
		const typeawareConfig = configs.find(config => config.name === RULES_TYPEAWARE);

		expect(typeawareConfig?.rules?.['typescript/no-deprecated']).toBe('warn');
		expect(typeawareConfig?.rules?.['typescript/prefer-readonly']).toEqual(['error']);
		expect(typeawareConfig?.rules?.['typescript/switch-exhaustiveness-check']).toEqual(['error']);
	});

	test('relaxes no-confusing-void-expression on TEST_GLOBS', async () => {
		const configs = await typescriptFactory({ project: ['tsconfig.json'] });
		const testing = configs.find(config => config.name === RULES_TEST);

		expect(testing?.rules?.['typescript/no-confusing-void-expression']).toBe('off');
	});

	test('snapshot: full config structure (non-type-aware)', async () => {
		const configs = await typescriptFactory({ project: true });
		const sanitised = configs.map(({ languageOptions, plugins, ...rest }) => ({
			...rest,
			languageOptions: languageOptions
				? { parser: languageOptions['parser'] ? '<parser>' : undefined }
				: undefined,
			plugins: plugins ? Object.keys(plugins) : undefined,
		}));

		expect(sanitised).toMatchSnapshot('typescript-non-type-aware');
	});

	test('snapshot: full config structure (type-aware)', async () => {
		const configs = await typescriptFactory({ project: ['tsconfig.json'] });
		const sanitised = configs.map(({ languageOptions, plugins, ...rest }) => ({
			...rest,
			languageOptions: languageOptions
				? { parser: languageOptions['parser'] ? '<parser>' : undefined }
				: undefined,
			plugins: plugins ? Object.keys(plugins) : undefined,
		}));

		expect(sanitised).toMatchSnapshot('typescript-type-aware');
	});

	test('appends consumer configs after the internal slice', async () => {
		const configs = await typescriptFactory(
			{ project: true },
			{ name: 'consumer/override', rules: { 'typescript/no-var': 'off' } }
		);

		expect(configs.at(-1)?.name).toBe('consumer/override');
	});
});
