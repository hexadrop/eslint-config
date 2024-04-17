import pluginImport from 'eslint-plugin-import-x';
import pluginImportSort from 'eslint-plugin-simple-import-sort';

import type { OptionsOverrides, StylisticConfig } from '../../options';
import type { TypedFlatConfigItem } from '../../types';

export default function imports(
	stylistic: false | (StylisticConfig & OptionsOverrides),
): TypedFlatConfigItem[] {
	return [
		{
			name: 'hexatool/imports/rules',
			plugins: stylistic
				? {
						import: pluginImport,
						'import-sort': pluginImportSort,
					}
				: {
						import: pluginImport,
					},
			settings: {
				'import-x/resolver': {
					node: true,
					typescript: true,
				},
			},
			rules: {
				// Import plugin
				'import/newline-after-import': 'error',
				'import/no-empty-named-blocks': 'error',
				'import/no-extraneous-dependencies': 'off',
				// Disabled due an incompatibility with package.json exports. See: https://github.com/import-js/eslint-plugin-import/issues/2703
				'import/no-mutable-exports': 'off',
				'import/no-named-as-default': 'off',
				'import/no-named-as-default-member': 'off',
				'import/no-unresolved': 'error',
				'import/no-webpack-loader-syntax': 'error',
				'import/default': 'error',
				'import/named': 'error',
				'import/namespace': 'error',
				'import/no-absolute-path': 'error',
				'import/no-useless-path-segments': 'error',
				'import/consistent-type-specifier-style': [
					'error',
					'prefer-top-level',
				],
				'import/no-namespace': 'error',

				...stylistic
					? {
							'import/exports-last': 'error',
							'import/first': 'error',
							'import/group-exports': 'error',
							'import/newline-after-import': [
								'error',
								{ count: 1 },
							],
							'import/no-anonymous-default-export': 'error',
							'import/no-duplicates': 'error',
							'import/prefer-default-export': 'error',
							'import-sort/exports': 'error',
							'import-sort/imports': 'error',
						}
					: {},
			},
		},
	];
}
