import {
	GLOB_REACT_JSX,
	GLOB_REACT_TSX,
	interopDefault,
	REACT_CONFIG_NAME_RULES,
	REACT_CONFIG_NAME_RULES_HOOKS,
	REACT_CONFIG_NAME_RULES_REFRESH,
	REACT_CONFIG_NAME_SETUP,
} from '@hexadrop/eslint-config-shared';
import { isPackageExists } from 'local-pkg';

import type { TypedFlatConfigItem } from './react.typed-config';

const REACT_REFRESH_ALLOW_CONSTANT_EXPORT_PACKAGES = ['vite'];

function isTypescriptAvailable(options: ReactConfigOptions): boolean {
	if (options.typescript !== undefined) {
		return options.typescript;
	}

	return isPackageExists('@hexadrop/eslint-config-typescript');
}

export default async function reactConfig(options: ReactConfigOptions = {}): Promise<TypedFlatConfigItem[]> {
	const isTypescript = isTypescriptAvailable(options);

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

export interface ReactConfigOptions {
	/**
	 * Whether typescript support should be enabled (TSX globs, TS-specific rules).
	 *
	 * When omitted, auto-detected via `@hexadrop/eslint-config-typescript` presence.
	 * Set explicitly to override auto-detection: `false` forces JS-only mode,
	 * `true` forces TS mode regardless of whether the peer is installed.
	 *
	 * @default undefined (auto-detect)
	 */
	typescript?: boolean;
}
