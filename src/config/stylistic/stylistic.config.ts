import { ESLint, Linter } from 'eslint';

import { PLUGIN_RENAME } from '../../const';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import renameRules from '../../utils/rename-rules';
import { JAVASCRIPT_GLOBS, SOURCE_GLOBS } from '../core';
import type { TypescriptOptions } from '../typescript';
import type { StylisticOptions } from './stylistic.options';
import stylisticOptionsDefault from './stylistic.options-default';
import prettierOptions from './stylistic.options-prettier';
import stylisticOptions from './stylistic.options-stylistic';

const STYLISTIC_CONFIG_NAME = 'hexatool/stylistic';
const PRETTIER_CONFIG_NAME = 'hexatool/prettier';

export default async function stylistic(
	options: StylisticOptions = true,
	typescript: TypescriptOptions = true
): Promise<TypedFlatConfigItem[]> {
	if (!options) {
		return [];
	}

	const requiredOptions = stylisticOptionsDefault(options);

	const configs: TypedFlatConfigItem[] = [];

	const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));
	const pluginStylisticOptions = stylisticOptions(requiredOptions);

	const unicorn = (await interopDefault(import('eslint-plugin-unicorn'))) as ESLint.Plugin;
	const unicornFlatRecommended = unicorn.configs
		? (unicorn.configs['flat/recommended'] as Linter.FlatConfig)
		: undefined;
	const unicornRules = unicornFlatRecommended?.rules as Linter.RulesRecord;
	const { rules } = pluginStylistic.configs.customize(pluginStylisticOptions);

	if (rules) {
		configs.push(
			{
				name: `${STYLISTIC_CONFIG_NAME}/rules`,
				plugins: {
					style: pluginStylistic as ESLint.Plugin,
				},
				rules: {
					...renameRules(rules as Linter.RulesRecord, PLUGIN_RENAME),
					curly: ['error', 'all'],
					'style/implicit-arrow-linebreak': ['error', 'beside'],
					'style/jsx-sort-props': 'error',
					'style/max-len': [
						'error',
						{ code: requiredOptions.printWidth, ignoreComments: true, ignoreUrls: true },
					],
					'style/no-extra-semi': 'error',
					'style/padding-line-between-statements': [
						'error',
						{ blankLine: 'always', next: 'return', prev: '*' },
					],
				},
			},
			{
				name: `${STYLISTIC_CONFIG_NAME}/rules/unicorn`,
				plugins: {
					unicorn,
				},
				rules: {
					...unicornRules,
					'unicorn/consistent-function-scoping': 'off',
					'unicorn/no-array-reduce': 'off',
					'unicorn/no-nested-ternary': 'off',
					'unicorn/no-static-only-class': 'off',
					'unicorn/prevent-abbreviations': [
						'error',
						{
							allowList: {
								ProcessEnv: true,
								Props: true,
							},
						},
					],
				},
			},
			{
				files: ['**/*.d.ts'],
				name: `${STYLISTIC_CONFIG_NAME}/rules/dts`,
				rules: {
					'style/spaced-comment': 'off',
				},
			}
		);
	}

	if (requiredOptions.sort) {
		const perfectionist = await interopDefault(import('eslint-plugin-perfectionist/configs/recommended-natural'));

		configs.push({
			name: `${STYLISTIC_CONFIG_NAME}/rules/sort`,
			plugins: {
				sort: perfectionist.plugins.perfectionist,
			},
			rules: {
				...renameRules(perfectionist.rules as unknown as Linter.RulesRecord, PLUGIN_RENAME),
				'sort/sort-classes': 'off',
				'sort/sort-imports': 'off',
				'sort/sort-interfaces': 'off',
				'sort/sort-named-exports': 'off',
			},
		});
	}

	if (requiredOptions.format) {
		const prettier = prettierOptions(requiredOptions);

		configs.push(
			{
				name: `${PRETTIER_CONFIG_NAME}/setup`,
				plugins: {
					format: await interopDefault(import('eslint-plugin-format')),
				},
			},
			{
				files: typescript ? SOURCE_GLOBS : JAVASCRIPT_GLOBS,
				name: `${PRETTIER_CONFIG_NAME}/rules`,
				rules: {
					'format/prettier': ['error', prettier],
				},
			}
		);
	}

	return configs;
}
