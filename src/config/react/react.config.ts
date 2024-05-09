import { isPackageExists } from 'local-pkg';

import type { HexatoolEslintOptions } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { ensurePackages, interopDefault } from '../../utils';
import {
	REACT_CONFIG_NAME_RULES,
	REACT_CONFIG_NAME_RULES_HOOKS,
	REACT_CONFIG_NAME_RULES_REFRESH,
	REACT_CONFIG_NAME_SETUP,
} from './react.config-name';
import { GLOB_REACT_JSX, GLOB_REACT_TSX } from './react.globs';

const REACT_REFRESH_ALLOW_CONSTANT_EXPORT_PACKAGES = ['vite'];

export default async function react(options: HexatoolEslintOptions): Promise<TypedFlatConfigItem[]> {
	const { react, typescript } = options;
	if (!react) {
		return [];
	}

	ensurePackages('eslint-plugin-react', 'eslint-plugin-react-hooks', 'eslint-plugin-react-refresh');

	const [pluginReact, pluginReactHooks, pluginReactRefresh] = await Promise.all([
		interopDefault(import('eslint-plugin-react')),
		interopDefault(import('eslint-plugin-react-hooks')),
		interopDefault(import('eslint-plugin-react-refresh')),
	] as const);
	const isAllowConstantExport = REACT_REFRESH_ALLOW_CONSTANT_EXPORT_PACKAGES.some(index => isPackageExists(index));

	const files = [...GLOB_REACT_JSX, ...(typescript ? GLOB_REACT_TSX : [])];

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

				...(!typescript && {
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
