import {
	GLOB_MARKDOWN,
	GLOB_MARKDOWN_ASTRO,
	GLOB_MARKDOWN_JSON,
	GLOB_MARKDOWN_SOURCE,
} from '@hexadrop/eslint-config-core';
import {
	interopDefault,
	STYLISTIC_CONFIG_NAME_RULES_UNICORN,
	STYLISTIC_CONFIG_NAME_RULES_UNICORN_MARKDOWN,
	STYLISTIC_CONFIG_NAME_RULES_UNICORN_MARKDOWN_SOURCE,
} from '@hexadrop/eslint-config-shared';

import type { StylisticConfigOptions } from '../stylistic.options';
import type { TypedFlatConfigItem } from '../stylistic.typed-config';

export default async function unicornAdapter(options: StylisticConfigOptions): Promise<TypedFlatConfigItem[]> {
	const { astro, json, markdown } = options;

	const pluginUnicorn = await interopDefault(import('eslint-plugin-unicorn'));
	const unicornRules = pluginUnicorn.configs.recommended.rules;

	const config: TypedFlatConfigItem[] = [
		{
			name: STYLISTIC_CONFIG_NAME_RULES_UNICORN,
			rules: {
				...unicornRules,
				'unicorn/consistent-boolean-name': [
					'error',
					{
						ignore: ['value', '^completed$'],
					},
				],
				'unicorn/consistent-class-member-order': 'off',
				'unicorn/consistent-function-scoping': 'off',
				'unicorn/dom-node-dataset': 'off',
				'unicorn/name-replacements': [
					'error',
					{
						allowList: {
							env: true,
							Environment: true,
							props: true,
							Props: true,
							repository: true,
							Repository: true,
						},
					},
				],
				'unicorn/no-array-reduce': 'off',
				'unicorn/no-nested-ternary': 'off',
				'unicorn/no-nonstandard-builtin-properties': 'off',
				'unicorn/no-static-only-class': 'off',
				'unicorn/prefer-includes-over-repeated-comparisons': 'off',
				'unicorn/prefer-number-coercion': 'off',
			},
		},
	];

	if (markdown) {
		config.push(
			{
				files: GLOB_MARKDOWN,
				name: STYLISTIC_CONFIG_NAME_RULES_UNICORN_MARKDOWN,
				rules: {
					'unicorn/filename-case': 'off',
				},
			},
			{
				files: [
					...GLOB_MARKDOWN_SOURCE,
					...(json ? GLOB_MARKDOWN_JSON : []),
					...(astro ? GLOB_MARKDOWN_ASTRO : []),
				],
				name: STYLISTIC_CONFIG_NAME_RULES_UNICORN_MARKDOWN_SOURCE,
				rules: {
					'unicorn/filename-case': 'off',
				},
			}
		);
	}

	return config;
}
