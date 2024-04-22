import { isPackageExists } from 'local-pkg';

import type { OptionsOverrides } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { ensurePackages, interopDefault } from '../../utils';
import type { TypescriptOptions } from '../typescript';
import { GLOB_JSX, GLOB_TSX } from './globs';

// React refresh
const ReactRefreshAllowConstantExportPackages = ['vite'];

export default async function react(
	options: OptionsOverrides | boolean = isPackageExists('react'),
	typescript: TypescriptOptions['typescript'] = isPackageExists('typescript'),
): Promise<TypedFlatConfigItem[]> {
	if (!options) {
		return [];
	}

	const {
		overrides = {},
	} = typeof options === 'object' ? options : {};

	ensurePackages(
		'eslint-plugin-react',
		'eslint-plugin-react-hooks',
		'eslint-plugin-react-refresh',
	);

	const files = [
		GLOB_JSX,
		GLOB_TSX,
	];

	/* eslint-disable typescript/no-unsafe-assignment */
	const [
		pluginReact,
		pluginReactHooks,
		pluginReactRefresh,
	] = await Promise.all([
		interopDefault(import('eslint-plugin-react')),
		interopDefault(import('eslint-plugin-react-hooks')),
		interopDefault(import('eslint-plugin-react-refresh')),
	] as const);
	/* eslint-enable typescript/no-unsafe-assignment */

	const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(
		index => isPackageExists(index),
	);

	return [
		{
			name: 'hexatool/react/setup',
			/* eslint-disable typescript/no-unsafe-assignment */
			plugins: {
				react: pluginReact,
				'react-hooks': pluginReactHooks,
				'react-refresh': pluginReactRefresh,
			},
			/* eslint-enable typescript/no-unsafe-assignment */
			settings: {
				react: {
					version: 'detect',
				},
			},
		},
		{
			files,
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
			name: 'hexatool/react/rules',
			rules: {
				// Recommended rules react
				'react/display-name': 'error',
				'react/jsx-key': 'error',

				'react/jsx-no-comment-textnodes': 'error',

				'react/jsx-no-duplicate-props': 'error',
				'react/jsx-no-target-blank': 'error',
				'react/jsx-no-undef': 'error',
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
				'react/prop-types': 'error',
				'react/react-in-jsx-scope': 'off',
				'react/require-render-return': 'error',
				// Recommended rules react-hooks
				'react-hooks/exhaustive-deps': 'warn',
				'react-hooks/rules-of-hooks': 'error',
				// React refresh
				'react-refresh/only-export-components': [
					'warn',
					{ allowConstantExport: isAllowConstantExport },
				],

				...typescript
					? {
							'react/jsx-no-undef': 'off',
							'react/prop-type': 'off',
						}
					: {},

				// Overrides
				...overrides,
			},
		},
	];
}
