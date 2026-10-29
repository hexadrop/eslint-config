import { afterEach, describe, expect, mock, test } from 'bun:test';

import astro, { config } from '../src';

const SETUP = 'hexadrop/astro/setup';
const SETUP_PARSER = 'hexadrop/astro/setup/parser';
const SETUP_PARSER_JS = 'hexadrop/astro/setup/parser/javascript';
const RULES = 'hexadrop/astro/rules';
const ASTRO_GLOBS = ['*.astro', '**/*.astro'];
const ASTRO_JS_GLOBS = ['**/*.astro/*.js', '*.astro/*.js'];
const ASTRO_TS_GLOBS = ['**/*.astro/*.ts', '*.astro/*.ts'];

const TYPESCRIPT_PKG = '@hexadrop/eslint-config-typescript';

function mockPackageAbsent() {
	void mock.module('local-pkg', () => ({
		isPackageExists: () => false,
	}));
}

function mockPackagePresent() {
	void mock.module('local-pkg', () => ({
		isPackageExists: (name: string) => name === TYPESCRIPT_PKG,
	}));
}

afterEach(() => {
	mock.restore();
});

describe('astro config', () => {
	test('returns an array with at least the internal slice entries', async () => {
		const configs = await config();

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBeGreaterThanOrEqual(4);
	});

	test('emits the astro config names', async () => {
		const configs = await config();
		const names = configs.map(c => c.name);

		expect(names).toContain(SETUP);
		expect(names).toContain(SETUP_PARSER);
		expect(names).toContain(SETUP_PARSER_JS);
		expect(names).toContain(RULES);
	});

	test('registers the astro plugin', async () => {
		const configs = await config();
		const setup = configs.find(c => c.name === SETUP);

		expect(setup?.plugins?.['astro']).toBeDefined();
	});

	test('parser entry covers .astro files', async () => {
		const configs = await config();
		const parserEntry = configs.find(c => c.name === SETUP_PARSER);

		expect(parserEntry?.files).toEqual(ASTRO_GLOBS);
	});

	test('javascript script entry covers .astro js script files', async () => {
		const configs = await config();
		const jsEntry = configs.find(c => c.name === SETUP_PARSER_JS);

		expect(jsEntry?.files).toEqual(ASTRO_JS_GLOBS);
	});

	test('uses astro/astro processor when typescript is absent', async () => {
		mockPackageAbsent();
		const configs = await config();
		const parserEntry = configs.find(c => c.name === SETUP_PARSER);

		expect(parserEntry?.processor).toBe('astro/astro');
	});

	test('uses astro/client-side-ts processor when typescript is present (auto-detect)', async () => {
		mockPackagePresent();
		const configs = await config();
		const parserEntry = configs.find(c => c.name === SETUP_PARSER);

		expect(parserEntry?.processor).toBe('astro/client-side-ts');
	});

	test('does not include TS script entry when typescript is absent', async () => {
		mockPackageAbsent();
		const configs = await config();
		const tsEntries = configs.filter(c => c.files === ASTRO_TS_GLOBS);

		expect(tsEntries.length).toBe(0);
	});

	test('includes TS script entry when typescript is present (auto-detect)', async () => {
		mockPackagePresent();
		const configs = await config();
		const tsEntries = configs.filter(
			c => Array.isArray(c.files) && c.files.length === ASTRO_TS_GLOBS.length && c.files[0] === ASTRO_TS_GLOBS[0]
		);

		expect(tsEntries.length).toBeGreaterThan(0);
	});

	test('throws actionable error when typescript is true but peer is missing', async () => {
		mockPackageAbsent();

		// eslint-disable-next-line typescript/await-thenable
		await expect(config({ typescript: true })).rejects.toThrow(
			'Astro typescript integration is enabled but @hexadrop/eslint-config-typescript is not installed. ' +
				'Install it with your package manager or set typescript: false to disable TS support.'
		);
	});

	test('processor is astro/astro when typescript is explicitly disabled', async () => {
		mockPackagePresent();
		const configs = await config({ typescript: false });
		const parserEntry = configs.find(c => c.name === SETUP_PARSER);

		expect(parserEntry?.processor).toBe('astro/astro');
	});

	test('processor is astro/client-side-ts when typescript is explicitly enabled', async () => {
		mockPackagePresent();
		const configs = await config({ typescript: true });
		const parserEntry = configs.find(c => c.name === SETUP_PARSER);

		expect(parserEntry?.processor).toBe('astro/client-side-ts');
	});

	test('has correct rule values', async () => {
		const configs = await config();
		const rulesEntry = configs.find(c => c.name === RULES);

		expect(rulesEntry?.rules?.['astro/missing-client-only-directive-value']).toBe('error');
		expect(rulesEntry?.rules?.['astro/no-conflict-set-directives']).toBe('error');
		expect(rulesEntry?.rules?.['astro/no-deprecated-astro-canonicalurl']).toBe('error');
		expect(rulesEntry?.rules?.['astro/no-deprecated-astro-fetchcontent']).toBe('error');
		expect(rulesEntry?.rules?.['astro/no-deprecated-astro-resolve']).toBe('error');
		expect(rulesEntry?.rules?.['astro/no-deprecated-getentrybyslug']).toBe('error');
		expect(rulesEntry?.rules?.['astro/no-unused-define-vars-in-style']).toBe('error');
		expect(rulesEntry?.rules?.['astro/valid-compile']).toBe('error');
		expect(rulesEntry?.rules?.['no-useless-assignment']).toBe('off');
	});

	test('factory returns FlatConfigComposer with correct config names', async () => {
		const configs = await astro();

		expect(configs).toBeDefined();
		const names = configs.map(c => c.name);

		expect(names).toContain(SETUP);
		expect(names).toContain(SETUP_PARSER);
		expect(names).toContain(SETUP_PARSER_JS);
		expect(names).toContain(RULES);
	});

	test('factory appends consumer configs after the internal slice', async () => {
		const configs = await astro({}, { name: 'consumer/override', rules: { 'astro/valid-compile': 'off' } });

		expect(configs.at(-1)?.name).toBe('consumer/override');
	});

	test('snapshot: full config structure (TS present)', async () => {
		mockPackagePresent();
		const configs = await config({ typescript: true });
		const sanitised = configs.map(({ languageOptions, plugins, ...rest }) => ({
			...rest,
			plugins: plugins ? Object.keys(plugins).toSorted((a, b) => a.localeCompare(b)) : undefined,
		}));

		expect(sanitised).toMatchSnapshot('astro-full-config-ts');
	});

	test('snapshot: full config structure (JS only)', async () => {
		mockPackageAbsent();
		const configs = await config({ typescript: false });
		const sanitised = configs.map(({ languageOptions, plugins, ...rest }) => ({
			...rest,
			plugins: plugins ? Object.keys(plugins).toSorted((a, b) => a.localeCompare(b)) : undefined,
		}));

		expect(sanitised).toMatchSnapshot('astro-full-config-js');
	});
});
