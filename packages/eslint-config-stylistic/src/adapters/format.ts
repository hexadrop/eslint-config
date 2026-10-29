import {
	GLOB_ASTRO,
	GLOB_MARKDOWN_ASTRO,
	GLOB_MARKDOWN_JSON,
	GLOB_MARKDOWN_SOURCE,
	JAVASCRIPT_GLOBS,
	SOURCE_GLOBS,
} from '@hexadrop/eslint-config-core';
import {
	STYLISTIC_CONFIG_NAME_RULES_PRETTIER,
	STYLISTIC_CONFIG_NAME_RULES_PRETTIER_ASTRO,
	STYLISTIC_CONFIG_NAME_RULES_PRETTIER_MARKDOWN_ASTRO,
	STYLISTIC_CONFIG_NAME_RULES_PRETTIER_MARKDOWN_SOURCE,
} from '@hexadrop/eslint-config-shared';

import type { StylisticConfigOptions } from '../stylistic.options';
import prettierOptions from '../stylistic.options-prettier';
import type { TypedFlatConfigItem } from '../stylistic.typed-config';

export default function formatAdapter(options: StylisticConfigOptions): TypedFlatConfigItem[] {
	const { astro, json, markdown, stylistic, typescript } = options;
	const prettierConfig = prettierOptions(stylistic);

	const config: TypedFlatConfigItem[] = [
		{
			files: typescript ? SOURCE_GLOBS : JAVASCRIPT_GLOBS,
			ignores: [
				...GLOB_MARKDOWN_SOURCE,
				...(json ? GLOB_MARKDOWN_JSON : []),
				...(astro ? GLOB_MARKDOWN_ASTRO : []),
			],
			name: STYLISTIC_CONFIG_NAME_RULES_PRETTIER,
			rules: {
				'format/prettier': ['error', { ...prettierConfig, parser: 'typescript' }],
			},
		},
	];

	if (astro) {
		config.push({
			files: GLOB_ASTRO,
			name: STYLISTIC_CONFIG_NAME_RULES_PRETTIER_ASTRO,
			rules: {
				'format/prettier': [
					'error',
					{
						...prettierConfig,
						parser: 'astro',
						plugins: ['prettier-plugin-astro'],
					},
				],
			},
		});
	}

	if (markdown) {
		config.push({
			files: GLOB_MARKDOWN_SOURCE,
			name: STYLISTIC_CONFIG_NAME_RULES_PRETTIER_MARKDOWN_SOURCE,
			rules: {
				'format/prettier': ['error', { ...prettierConfig, parser: 'typescript', tabWidth: 2, useTabs: false }],
			},
		});
		if (astro) {
			config.push({
				files: GLOB_MARKDOWN_ASTRO,
				name: STYLISTIC_CONFIG_NAME_RULES_PRETTIER_MARKDOWN_ASTRO,
				rules: {
					'format/prettier': [
						'error',
						{
							...prettierConfig,
							parser: 'astro',
							plugins: ['prettier-plugin-astro'],
							tabWidth: 2,
							useTabs: false,
						},
					],
				},
			});
		}
	}

	return config;
}
