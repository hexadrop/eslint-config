import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';
import { ESLint, Linter } from 'eslint';
import type { RequiredOptions } from 'prettier';

import { PLUGIN_RENAME } from '../../const';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import renameRules from '../../utils/rename-rules';
import { JAVASCRIPT_GLOBS, SOURCE_GLOBS } from '../core';
import type { TypescriptOptions } from '../typescript';
import type { StylisticOptions } from './stylistic.options';

const STYLISTIC_CONFIG_NAME = 'hexatool/stylistic';

export default async function stylistic(
	options: StylisticOptions = true,
	typescript: TypescriptOptions = true
): Promise<TypedFlatConfigItem[]> {
	if (!options) {
		return [];
	}

	const {
		arrowParens = 'avoid',
		braceStyle = '1tbs',
		bracketSameLine = true,
		bracketSpacing = true,
		endOfLine = 'lf',
		format = 'prettier',
		indent = 'tab',
		indentSize = 4,
		printWidth = 120,
		quoteProps = 'as-needed',
		quotes = 'single',
		semicolons = true,
		singleAttributePerLine = false,
		sort = true,
		trailingComma = 'es5',
	} = typeof options === 'object' ? options : {};

	const configs: TypedFlatConfigItem[] = [];

	const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));
	const pluginStylisticOptions: StylisticCustomizeOptions = {
		arrowParens: format ? false : Boolean(arrowParens),
		blockSpacing: bracketSpacing,
		braceStyle,
		commaDangle: trailingComma === 'es5' ? 'only-multiline' : trailingComma === 'none' ? 'never' : 'always',
		indent: indent === 'tab' ? 'tab' : indentSize,
		jsx: true,
		quoteProps: quoteProps === 'preserve' ? 'as-needed' : quoteProps,
		quotes,
		semi: semicolons,
	};

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
					'style/max-len': ['error', { code: printWidth, ignoreComments: true, ignoreUrls: true }],
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

	if (format) {
		const prettierOptions: Partial<RequiredOptions> = {
			arrowParens,
			bracketSameLine,
			bracketSpacing,
			endOfLine,
			jsxSingleQuote: quotes === 'single',
			parser: typescript ? 'typescript' : 'babel',
			printWidth,
			quoteProps,
			semi: semicolons,
			singleAttributePerLine,
			singleQuote: quotes === 'single',
			tabWidth: indentSize,
			trailingComma,
			useTabs: indent === 'tab',
		};

		configs.push({
			files: typescript ? SOURCE_GLOBS : JAVASCRIPT_GLOBS,
			name: `${STYLISTIC_CONFIG_NAME}/rules/prettier`,
			plugins: {
				format: await interopDefault(import('eslint-plugin-format')),
			},
			rules: {
				'format/prettier': ['error', prettierOptions],
			},
		});
	}

	if (sort) {
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

	return configs;
}
