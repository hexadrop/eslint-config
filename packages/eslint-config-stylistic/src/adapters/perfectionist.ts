import { interopDefault, STYLISTIC_CONFIG_NAME_RULES_PERFECTIONIST } from '@hexadrop/eslint-config-shared';

import type { TypedFlatConfigItem } from '../stylistic.typed-config';

export default async function perfectionistAdapter(): Promise<TypedFlatConfigItem[]> {
	const pluginPerfectionistRoot = await interopDefault(import('eslint-plugin-perfectionist'));
	const pluginPerfectionist = pluginPerfectionistRoot.configs['recommended-natural'];

	return [
		{
			name: STYLISTIC_CONFIG_NAME_RULES_PERFECTIONIST,
			rules: {
				...pluginPerfectionist.rules,
				'perfectionist/sort-classes': 'off',
				'perfectionist/sort-exports': 'off',
				'perfectionist/sort-imports': 'off',
				'perfectionist/sort-interfaces': 'off',
				'perfectionist/sort-jsx-props': 'error',
				'perfectionist/sort-modules': 'off',
				'perfectionist/sort-named-exports': 'off',
				'perfectionist/sort-named-imports': 'off',
				'perfectionist/sort-object': [
					'off',
					{
						specialCharacters: 'trim',
					},
				],
				'perfectionist/sort-object-types': 'off',
			},
		},
	];
}
