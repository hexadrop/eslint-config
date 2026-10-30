import path from 'node:path';
import process from 'node:process';

import { afterEach, describe, expect, mock, test } from 'bun:test';

import react, { config } from '../src';

const SETUP = 'hexadrop/react/setup';
const RULES = 'hexadrop/react/rules';
const RULES_HOOKS = 'hexadrop/react/rules/hooks';
const RULES_REFRESH = 'hexadrop/react/rules/refresh';
const JSX_GLOBS = ['**/*.?([cm])jsx', '**/*.?([cm])tsx'];
const JS_GLOBS = ['**/*.?([cm])jsx'];

const TYPESCRIPT_PKG = '@hexadrop/eslint-config-typescript';
const REACT_VERSION = '19.2.8';

const FIXTURES_DIR = path.join(import.meta.dir, 'fixtures');
const INITIAL_CWD = process.cwd();

interface MockPackagesOptions {
	reactVersion?: string | undefined;
	typescript?: boolean;
}

function mockPackages(options: MockPackagesOptions = {}) {
	const reactVersion = 'reactVersion' in options ? options.reactVersion : REACT_VERSION;

	void mock.module('local-pkg', () => ({
		getPackageInfoSync: (name: string) =>
			name === 'react' && reactVersion ? { name, version: reactVersion } : undefined,
		isPackageExists: (name: string) => Boolean(options.typescript) && name === TYPESCRIPT_PKG,
	}));
}

/**
 * Build the config as if it ran inside one of the fixture projects: the
 * react-refresh gate reads the consumer `package.json` from the cwd.
 */
function useProject(name: string) {
	process.chdir(path.join(FIXTURES_DIR, name));
}

function mockPackageAbsent() {
	mockPackages();
}

function mockPackagePresent() {
	mockPackages({ typescript: true });
}

function mockReactAbsent() {
	mockPackages({ reactVersion: undefined, typescript: true });
}

function mockWithFastRefresh() {
	mockPackages({ typescript: true });
	useProject('vite');
}

function mockWithoutFastRefresh() {
	mockPackages({ typescript: true });
	useProject('vitest-only');
}

afterEach(() => {
	process.chdir(INITIAL_CWD);
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

	test('settings pins the installed react version instead of detect', async () => {
		mockPackagePresent();
		const configs = await config();
		const setup = configs.find(c => c.name === SETUP);

		const settings = setup?.settings as Record<string, Record<string, unknown>> | undefined;

		expect(settings?.['react']?.['version']).toBe(REACT_VERSION);
	});

	test('omits the react settings when react cannot be resolved', async () => {
		mockReactAbsent();
		const configs = await config({ typescript: false });
		const setup = configs.find(c => c.name === SETUP);

		expect(setup?.settings).toBeUndefined();
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

	test('react-refresh rule is present as warn when the project declares Vite', async () => {
		mockWithFastRefresh();
		const configs = await config();
		const refresh = configs.find(c => c.name === RULES_REFRESH);

		const rule = refresh?.rules?.['react-refresh/only-export-components'];
		const level = Array.isArray(rule) ? rule[0] : undefined;

		expect(level).toBe('warn');
	});

	test('react-refresh is off by default without a fast refresh bundler', async () => {
		mockWithoutFastRefresh();
		const configs = await config();
		const refresh = configs.find(c => c.name === RULES_REFRESH);

		expect(refresh?.rules?.['react-refresh/only-export-components']).toBe('off');
	});

	test('refresh: true forces the rule on without a fast refresh bundler', async () => {
		mockWithoutFastRefresh();
		const configs = await config({ refresh: true });
		const refresh = configs.find(c => c.name === RULES_REFRESH);

		const rule = refresh?.rules?.['react-refresh/only-export-components'];

		expect(Array.isArray(rule) ? rule[0] : undefined).toBe('warn');
	});

	test('refresh: false disables the rule even with Fast Refresh', async () => {
		mockWithFastRefresh();
		const configs = await config({ refresh: false });
		const refresh = configs.find(c => c.name === RULES_REFRESH);

		expect(refresh?.rules?.['react-refresh/only-export-components']).toBe('off');
	});

	test('refresh options forward allowExportNames', async () => {
		mockWithoutFastRefresh();
		const configs = await config({ refresh: { allowExportNames: ['loader'] } });
		const refresh = configs.find(c => c.name === RULES_REFRESH);

		const rule = refresh?.rules?.['react-refresh/only-export-components'];
		const settings = Array.isArray(rule) ? rule[1] : undefined;

		expect(settings).toEqual({ allowConstantExport: false, allowExportNames: ['loader'] });
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
		mockWithFastRefresh();
		const configs = await config({ typescript: true });
		const sanitised = configs.map(({ languageOptions, plugins, ...rest }) => ({
			...rest,
			plugins: plugins ? Object.keys(plugins).toSorted((a, b) => a.localeCompare(b)) : undefined,
		}));

		expect(sanitised).toMatchSnapshot('react-full-config-ts');
	});

	test('snapshot: full config structure (JS only)', async () => {
		mockWithFastRefresh();
		const configs = await config({ typescript: false });
		const sanitised = configs.map(({ languageOptions, plugins, ...rest }) => ({
			...rest,
			plugins: plugins ? Object.keys(plugins).toSorted((a, b) => a.localeCompare(b)) : undefined,
		}));

		expect(sanitised).toMatchSnapshot('react-full-config-js');
	});
});
