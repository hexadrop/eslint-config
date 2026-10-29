import { afterEach, describe, expect, mock, test } from 'bun:test';

import react, { config } from '../src';

const SETUP = 'hexadrop/react/setup';
const RULES = 'hexadrop/react/rules';
const RULES_HOOKS = 'hexadrop/react/rules/hooks';
const RULES_REFRESH = 'hexadrop/react/rules/refresh';
const JSX_GLOBS = ['**/*.?([cm])jsx', '**/*.?([cm])tsx'];
const JS_GLOBS = ['**/*.?([cm])jsx'];

const TYPESCRIPT_PKG = '@hexadrop/eslint-config-typescript';

function mockPackageAbsent() {
	void mock.module('local-pkg', () => ({
		isPackageExists: (name: string) => name === 'vite',
	}));
}

function mockPackagePresent() {
	void mock.module('local-pkg', () => ({
		isPackageExists: (name: string) => name === 'vite' || name === TYPESCRIPT_PKG,
	}));
}

afterEach(() => {
	mock.restore();
});

describe('react config', () => {
	test('returns an array with at least the internal slice entries', async () => {
		const configs = await config();

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBeGreaterThanOrEqual(4);
	});

	test('emits the react config names', async () => {
		const configs = await config();
		const names = configs.map(c => c.name);

		expect(names).toContain(SETUP);
		expect(names).toContain(RULES);
		expect(names).toContain(RULES_HOOKS);
		expect(names).toContain(RULES_REFRESH);
	});

	test('registers all three react plugins under expected keys', async () => {
		const configs = await config();
		const setup = configs.find(c => c.name === SETUP);

		expect(setup?.plugins?.['react']).toBeDefined();
		expect(setup?.plugins?.['react-hooks']).toBeDefined();
		expect(setup?.plugins?.['react-refresh']).toBeDefined();
	});

	test('settings has react version set to detect', async () => {
		const configs = await config();
		const setup = configs.find(c => c.name === SETUP);

		const settings = setup?.settings as Record<string, Record<string, unknown>> | undefined;

		expect(settings?.['react']?.['version']).toBe('detect');
	});

	test('includes TSX globs when typescript is auto-detected (default)', async () => {
		mockPackagePresent();
		const configs = await config();
		const rules = configs.find(c => c.name === RULES);

		expect(rules?.files).toEqual(JSX_GLOBS);
	});

	test('only JSX globs when typescript is false', async () => {
		const configs = await config({ typescript: false });
		const rules = configs.find(c => c.name === RULES);

		expect(rules?.files).toEqual(JS_GLOBS);
	});

	test('includes TSX globs when typescript is true and peer is installed', async () => {
		mockPackagePresent();
		const configs = await config({ typescript: true });
		const rules = configs.find(c => c.name === RULES);

		expect(rules?.files).toEqual(JSX_GLOBS);
	});

	test('throws actionable error when typescript is true but peer is missing', async () => {
		mockPackageAbsent();

		// eslint-disable-next-line typescript/await-thenable
		await expect(config({ typescript: true })).rejects.toThrow(
			'React typescript integration is enabled but @hexadrop/eslint-config-typescript is not installed. ' +
				'Install it with your package manager or set typescript: false to disable TS support.'
		);
	});

	test('includes TS-specific rules when typescript is disabled', async () => {
		const configs = await config({ typescript: false });
		const rules = configs.find(c => c.name === RULES);

		expect(rules?.rules?.['react/jsx-no-undef']).toBe('error');
		expect(rules?.rules?.['react/prop-types']).toBe('error');
	});

	test('excludes TS-specific rules when typescript is enabled', async () => {
		mockPackagePresent();
		const configs = await config({ typescript: true });
		const rules = configs.find(c => c.name === RULES);

		expect(rules?.rules?.['react/jsx-no-undef']).toBeUndefined();
		expect(rules?.rules?.['react/prop-types']).toBeUndefined();
	});

	test('hooks rules are present on react files', async () => {
		const configs = await config();
		const hooks = configs.find(c => c.name === RULES_HOOKS);

		expect(hooks?.rules?.['react-hooks/exhaustive-deps']).toBe('error');
		expect(hooks?.rules?.['react-hooks/rules-of-hooks']).toBe('error');
	});

	test('react-refresh rule is present as warn', async () => {
		const configs = await config();
		const refresh = configs.find(c => c.name === RULES_REFRESH);

		const rule = refresh?.rules?.['react-refresh/only-export-components'];
		const level = Array.isArray(rule) ? rule[0] : undefined;

		expect(level).toBe('warn');
	});

	test('factory returns FlatConfigComposer with correct config names', async () => {
		const configs = await react();

		expect(configs).toBeDefined();
		const names = configs.map(c => c.name);

		expect(names).toContain(SETUP);
		expect(names).toContain(RULES);
		expect(names).toContain(RULES_HOOKS);
		expect(names).toContain(RULES_REFRESH);
	});

	test('factory appends consumer configs after the internal slice', async () => {
		const configs = await react({}, { name: 'consumer/override', rules: { 'react/no-unsafe': 'error' } });

		expect(configs.at(-1)?.name).toBe('consumer/override');
	});

	test('snapshot: full config structure (TS available)', async () => {
		mockPackagePresent();
		const configs = await config({ typescript: true });
		const sanitised = configs.map(({ languageOptions, plugins, ...rest }) => ({
			...rest,
			plugins: plugins ? Object.keys(plugins).toSorted((a, b) => a.localeCompare(b)) : undefined,
		}));

		expect(sanitised).toMatchSnapshot('react-full-config-ts');
	});

	test('snapshot: full config structure (JS only)', async () => {
		const configs = await config({ typescript: false });
		const sanitised = configs.map(({ languageOptions, plugins, ...rest }) => ({
			...rest,
			plugins: plugins ? Object.keys(plugins).toSorted((a, b) => a.localeCompare(b)) : undefined,
		}));

		expect(sanitised).toMatchSnapshot('react-full-config-js');
	});
});
