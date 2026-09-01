import { describe, expect, mock, test } from 'bun:test';

import astro, {
	ASTRO_CONFIG_NAME_RULES,
	ASTRO_CONFIG_NAME_SETUP,
	ASTRO_CONFIG_NAME_SETUP_PARSER,
	ASTRO_CONFIG_NAME_SETUP_PARSER_JAVASCRIPT,
	ASTRO_CONFIG_NAME_SETUP_PARSER_TYPESCRIPT,
	GLOB_ASTRO,
	GLOB_ASTRO_JAVASCRIPT,
	GLOB_ASTRO_TYPESCRIPT,
} from '../src';

/**
 * `@hexadrop/eslint-config-typescript` is a workspace package, so the optional
 * peer is always resolvable. The typescript-flavor tests opt out of the peer
 * check with `peerCheck: false` (the same escape hatch the meta-package uses).
 * The error path is exercised by mocking `local-pkg` to simulate peer absence.
 */
let isTypescriptPeerMocked = true;

// eslint-disable-next-line typescript/no-floating-promises
mock.module('local-pkg', () => ({
	isPackageExists: (package_: string) =>
		package_ === '@hexadrop/eslint-config-typescript' ? isTypescriptPeerMocked : false,
}));
describe('astro factory', () => {
	test('returns a thenable composer resolving to the astro config slice', async () => {
		const configs = await astro({ typescript: false });

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(4);
	});

	test('emits the setup, parser, javascript, typescript and rules config names', async () => {
		const configs = await astro({ peerCheck: false, typescript: true });
		const names = configs.map(config => config.name);

		expect(names).toContain(ASTRO_CONFIG_NAME_SETUP);
		expect(names).toContain(ASTRO_CONFIG_NAME_SETUP_PARSER);
		expect(names).toContain(ASTRO_CONFIG_NAME_SETUP_PARSER_JAVASCRIPT);
		expect(names).toContain(ASTRO_CONFIG_NAME_SETUP_PARSER_TYPESCRIPT);
		expect(names).toContain(ASTRO_CONFIG_NAME_RULES);
	});

	test('registers the astro plugin', async () => {
		const configs = await astro({ typescript: false });
		const setup = configs.find(config => config.name === ASTRO_CONFIG_NAME_SETUP);

		expect(setup?.plugins?.['astro']).toBeDefined();
	});

	test('without the typescript peer, parser uses the js-only path', async () => {
		const configs = await astro({ typescript: false });
		const parser = configs.find(config => config.name === ASTRO_CONFIG_NAME_SETUP_PARSER);

		expect(parser?.processor).toBe('astro/astro');
		expect(parser?.languageOptions?.['parser']).toBeDefined();
	});

	test('without the typescript peer, the typescript config item is absent', async () => {
		const configs = await astro({ typescript: false });
		const typescriptConfig = configs.find(config => config.name === ASTRO_CONFIG_NAME_SETUP_PARSER_TYPESCRIPT);

		expect(typescriptConfig).toBeUndefined();
	});

	test('with the typescript flavor enabled, parser uses the ts path', async () => {
		const configs = await astro({ peerCheck: false, typescript: true });
		const parser = configs.find(config => config.name === ASTRO_CONFIG_NAME_SETUP_PARSER);

		expect(parser?.processor).toBe('astro/client-side-ts');
		expect(parser?.languageOptions?.['parserOptions']).toBeTruthy();
		expect((parser?.languageOptions?.['parserOptions'] as Record<string, unknown>)['parser']).toBeDefined();
	});

	test('with the typescript flavor enabled, the typescript config item targets ts globs', async () => {
		const configs = await astro({ peerCheck: false, typescript: true });
		const typescriptConfig = configs.find(config => config.name === ASTRO_CONFIG_NAME_SETUP_PARSER_TYPESCRIPT);

		expect(typescriptConfig?.files).toEqual(GLOB_ASTRO_TYPESCRIPT);
	});

	test('rules target .astro files', async () => {
		const configs = await astro({ typescript: false });
		const rules = configs.find(config => config.name === ASTRO_CONFIG_NAME_RULES);

		expect(rules?.files).toEqual(GLOB_ASTRO);
		expect(rules?.rules?.['astro/valid-compile']).toBe('error');
		expect(rules?.rules?.['astro/no-deprecated-astro-resolve']).toBe('error');
	});

	test('javascript inline scripts config targets js globs', async () => {
		const configs = await astro({ typescript: false });
		const js = configs.find(config => config.name === ASTRO_CONFIG_NAME_SETUP_PARSER_JAVASCRIPT);

		expect(js?.files).toEqual(GLOB_ASTRO_JAVASCRIPT);
	});

	test('fails with an actionable error when typescript is enabled without the peer', async () => {
		// eslint-disable-next-line unicorn/no-top-level-assignment-in-function
		isTypescriptPeerMocked = false;
		let error: Error | undefined;
		try {
			await astro({ typescript: true });
		} catch (error_) {
			error = error_ as Error;
		} finally {
			// eslint-disable-next-line unicorn/no-top-level-assignment-in-function
			isTypescriptPeerMocked = true;
		}

		expect(error?.message).toContain(
			'The "typescript" option of @hexadrop/eslint-config-astro requires the optional peer "@hexadrop/eslint-config-typescript"'
		);
		expect(error?.message).toContain('bun add --dev @hexadrop/eslint-config-typescript');
	});

	test('integrators can opt out of the peer check with peerCheck: false', async () => {
		const configs = await astro({ peerCheck: false, typescript: true });
		const parser = configs.find(config => config.name === ASTRO_CONFIG_NAME_SETUP_PARSER);

		expect(parser?.processor).toBe('astro/client-side-ts');
	});

	test('falls back to peer presence detection when typescript is undefined', async () => {
		const configs = await astro();
		const parser = configs.find(config => config.name === ASTRO_CONFIG_NAME_SETUP_PARSER);

		// The peer is a workspace package, so presence detection activates the ts path.
		expect(parser?.processor).toBe('astro/client-side-ts');
	});

	test('disabling the astro option resolves to an empty pipeline', async () => {
		const configs = await astro({ astro: false });

		expect(configs).toEqual([]);
	});

	test('accepts a flat config item mixed into the first argument', async () => {
		const configs = await astro({
			astro: true,
			name: 'consumer/inline',
			rules: { 'astro/semi': 'off' },
			typescript: false,
		});
		const inline = configs.find(config => config.name === 'consumer/inline');

		expect(inline?.rules?.['astro/semi']).toBe('off');
	});

	test('appends consumer configs after the astro slice', async () => {
		const configs = await astro(
			{ astro: true, typescript: false },
			{ name: 'consumer/override', rules: { 'astro/semi': 'off' } }
		);

		expect(configs.at(-1)?.name).toBe('consumer/override');
	});
});
