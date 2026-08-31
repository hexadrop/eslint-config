import { interopDefault } from '@hexadrop/eslint-config-shared';
import { isPackageExists } from 'local-pkg';

import {
	REACT_CONFIG_NAME_RULES,
	REACT_CONFIG_NAME_RULES_HOOKS,
	REACT_CONFIG_NAME_RULES_REFRESH,
	REACT_CONFIG_NAME_SETUP,
} from './react.config-name';
import { GLOB_REACT_JSX, GLOB_REACT_TSX } from './react.globs';
import type { TypedFlatConfigItem } from './react.typed-config';

const REACT_REFRESH_ALLOW_CONSTANT_EXPORT_PACKAGES = ['vite'];
const TYPESCRIPT_PACKAGE_NAME = '@hexadrop/eslint-config-typescript';

interface HexadropEslintReactOptions {
	/**
	 * Skip the optional-peer check when enabling the typescript flavor.
	 *
	 * Internal escape hatch for integrators that own the typescript concern
	 * themselves (the `@hexadrop/eslint-config` meta-package). Standalone
	 * consumers should never set this.
	 *
	 * @default true
	 * @internal
	 */
	peerCheck?: boolean | undefined;

	/**
	 * Enable react support.
	 *
	 * @default true
	 */
	react?: boolean | undefined;

	/**
	 * Enable the typescript flavor of the react rules.
	 *
	 * When `undefined`, the typescript flavor activates automatically when the
	 * optional peer `@hexadrop/eslint-config-typescript` is installed. Passing
	 * `true` while the peer is missing throws an actionable install error.
	 */
	typescript?: boolean | undefined;
}

async function reactConfig(options: HexadropEslintReactOptions): Promise<TypedFlatConfigItem[]> {
	const { peerCheck = true, react: enabled, typescript: typescriptOption } = options;
	if (!enabled) {
		return [];
	}

	/*
	 * `typescript: true` requires the optional peer's rule dependencies to be
	 * resolvable. Integrators that own the typescript concern (the
	 * `@hexadrop/eslint-config` meta-package) resolve them themselves and opt
	 * out of the check with `peerCheck: false`.
	 */
	const isTypescriptPeerInstalled = isPackageExists(TYPESCRIPT_PACKAGE_NAME);
	if (typescriptOption === true && !isTypescriptPeerInstalled && peerCheck) {
		throw new Error(
			`The "typescript" option of @hexadrop/eslint-config-react requires the optional peer "${TYPESCRIPT_PACKAGE_NAME}" to be installed. Install it with: bun add --dev ${TYPESCRIPT_PACKAGE_NAME}`
		);
	}
	const isTypescript = typescriptOption ?? isTypescriptPeerInstalled;

	const [pluginReact, pluginReactHooks, pluginReactRefresh] = await Promise.all([
		interopDefault(import('eslint-plugin-react')),
		interopDefault(import('eslint-plugin-react-hooks')),
		interopDefault(import('eslint-plugin-react-refresh')),
	] as const);
	const isAllowConstantExport = REACT_REFRESH_ALLOW_CONSTANT_EXPORT_PACKAGES.some(index => isPackageExists(index));

	const files = [...GLOB_REACT_JSX, ...(isTypescript ? GLOB_REACT_TSX : [])];

	return [
		{
			name: REACT_CONFIG_NAME_SETUP,
			plugins: {
				react: pluginReact,
				'react-hooks': pluginReactHooks,
				'react-refresh': pluginReactRefresh,
			},
			settings: {
				react: {
					version: 'detect',
				},
			},
		},
		{
			files,
			name: REACT_CONFIG_NAME_RULES,
			rules: {
				'react/display-name': 'error',
				'react/jsx-key': 'error',

				'react/jsx-no-comment-textnodes': 'error',

				'react/jsx-no-duplicate-props': 'error',
				'react/jsx-no-target-blank': 'error',
				'react/jsx-uses-react': 'error',
				'react/jsx-uses-vars': 'error',
				'react/no-children-prop': 'error',
				'react/no-danger-with-children': 'error',
				'react/no-deprecated': 'error',
				'react/no-direct-mutation-state': 'error',
				'react/no-find-dom-node': 'error',
				'react/no-is-mounted': 'error',
				'react/no-render-return-value': 'error',
				'react/no-string-refs': 'error',
				'react/no-unescaped-entities': 'error',
				'react/no-unknown-property': 'error',
				'react/no-unsafe': 'off',
				'react/react-in-jsx-scope': 'off',
				'react/require-render-return': 'error',

				...(!isTypescript && {
					'react/jsx-no-undef': 'error',
					'react/prop-types': 'error',
				}),
			},
		},
		{
			files,
			name: REACT_CONFIG_NAME_RULES_HOOKS,
			rules: {
				'react-hooks/exhaustive-deps': 'error',
				'react-hooks/rules-of-hooks': 'error',
			},
		},
		{
			files,
			name: REACT_CONFIG_NAME_RULES_REFRESH,
			rules: {
				'react-refresh/only-export-components': ['warn', { allowConstantExport: isAllowConstantExport }],
			},
		},
	];
}

export type { HexadropEslintReactOptions };

export default reactConfig;
