import { describe, expect, mock, test } from 'bun:test';

import react, {
	GLOB_REACT_JSX,
	GLOB_REACT_TSX,
	REACT_CONFIG_NAME_RULES,
	REACT_CONFIG_NAME_RULES_HOOKS,
	REACT_CONFIG_NAME_RULES_REFRESH,
	REACT_CONFIG_NAME_SETUP,
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
describe('react factory', () => {
	test('returns a thenable composer resolving to the react config slice', async () => {
		const configs = await react({ typescript: false });

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(4);
	});

	test('emits the setup, rules, hooks and refresh config names', async () => {
		const configs = await react({ typescript: false });
		const names = configs.map(config => config.name);

		expect(names).toContain(REACT_CONFIG_NAME_SETUP);
		expect(names).toContain(REACT_CONFIG_NAME_RULES);
		expect(names).toContain(REACT_CONFIG_NAME_RULES_HOOKS);
		expect(names).toContain(REACT_CONFIG_NAME_RULES_REFRESH);
	});

	test('registers the react, react-hooks and react-refresh plugins and detects the react version', async () => {
		const configs = await react({ typescript: false });
		const setup = configs.find(config => config.name === REACT_CONFIG_NAME_SETUP);

		expect(setup?.plugins?.['react']).toBeDefined();
		expect(setup?.plugins?.['react-hooks']).toBeDefined();
		expect(setup?.plugins?.['react-refresh']).toBeDefined();
		expect(setup?.settings?.['react']).toEqual({ version: 'detect' });
	});

	test('without the typescript peer, rules target only the jsx globs', async () => {
		const configs = await react({ typescript: false });
		const rules = configs.find(config => config.name === REACT_CONFIG_NAME_RULES);

		expect(rules?.files).toEqual(GLOB_REACT_JSX);
	});

	test('without the typescript peer, js-only guards stay enabled', async () => {
		const configs = await react({ typescript: false });
		const rules = configs.find(config => config.name === REACT_CONFIG_NAME_RULES);

		expect(rules?.rules?.['react/jsx-no-undef']).toBe('error');
		expect(rules?.rules?.['react/prop-types']).toBe('error');
	});

	test('with the typescript flavor enabled, rules also target the tsx globs', async () => {
		const configs = await react({ peerCheck: false, typescript: true });
		const rules = configs.find(config => config.name === REACT_CONFIG_NAME_RULES);

		expect(rules?.files).toEqual([...GLOB_REACT_JSX, ...GLOB_REACT_TSX]);
	});

	test('with the typescript flavor enabled, js-only guards are disabled', async () => {
		const configs = await react({ peerCheck: false, typescript: true });
		const rules = configs.find(config => config.name === REACT_CONFIG_NAME_RULES);

		expect(rules?.rules?.['react/jsx-no-undef']).toBeUndefined();
		expect(rules?.rules?.['react/prop-types']).toBeUndefined();
	});

	test('hooks and refresh rules target the same globs as the base rules', async () => {
		const configs = await react({ peerCheck: false, typescript: true });
		const files = [...GLOB_REACT_JSX, ...GLOB_REACT_TSX];
		const hooks = configs.find(config => config.name === REACT_CONFIG_NAME_RULES_HOOKS);
		const refresh = configs.find(config => config.name === REACT_CONFIG_NAME_RULES_REFRESH);

		expect(hooks?.files).toEqual(files);
		expect(hooks?.rules?.['react-hooks/rules-of-hooks']).toBe('error');
		expect(hooks?.rules?.['react-hooks/exhaustive-deps']).toBe('error');
		expect(refresh?.files).toEqual(files);
		expect(refresh?.rules?.['react-refresh/only-export-components']).toBeDefined();
	});

	test('fails with an actionable error when typescript is enabled without the peer', async () => {
		// eslint-disable-next-line unicorn/no-top-level-assignment-in-function
		isTypescriptPeerMocked = false;
		let error: Error | undefined;
		try {
			await react({ typescript: true });
		} catch (error_) {
			error = error_ as Error;
		} finally {
			// eslint-disable-next-line unicorn/no-top-level-assignment-in-function
			isTypescriptPeerMocked = true;
		}

		expect(error?.message).toContain(
			'The "typescript" option of @hexadrop/eslint-config-react requires the optional peer "@hexadrop/eslint-config-typescript"'
		);
		expect(error?.message).toContain('bun add --dev @hexadrop/eslint-config-typescript');
	});

	test('integrators can opt out of the peer check with peerCheck: false', async () => {
		const configs = await react({ peerCheck: false, typescript: true });
		const rules = configs.find(config => config.name === REACT_CONFIG_NAME_RULES);

		expect(rules?.files).toEqual([...GLOB_REACT_JSX, ...GLOB_REACT_TSX]);
	});

	test('falls back to peer presence detection when typescript is undefined', async () => {
		const configs = await react();
		const rules = configs.find(config => config.name === REACT_CONFIG_NAME_RULES);

		// The peer is a workspace package, so presence detection activates tsx mode.
		expect(rules?.files).toEqual([...GLOB_REACT_JSX, ...GLOB_REACT_TSX]);
		expect(rules?.rules?.['react/prop-types']).toBeUndefined();
	});

	test('disabling the react option resolves to an empty pipeline', async () => {
		const configs = await react({ react: false });

		expect(configs).toEqual([]);
	});

	test('accepts a flat config item mixed into the first argument', async () => {
		const configs = await react({
			name: 'consumer/inline',
			react: true,
			rules: { 'react/display-name': 'off' },
			typescript: false,
		});
		const inline = configs.find(config => config.name === 'consumer/inline');

		expect(inline?.rules?.['react/display-name']).toBe('off');
	});

	test('appends consumer configs after the react slice', async () => {
		const configs = await react(
			{ react: true, typescript: false },
			{ name: 'consumer/override', rules: { 'react/display-name': 'off' } }
		);

		expect(configs.at(-1)?.name).toBe('consumer/override');
	});
});
