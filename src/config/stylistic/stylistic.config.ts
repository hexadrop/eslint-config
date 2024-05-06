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
		braceStyle = '1tbs',
		semicolons = true,
		quotes = 'single',
		printWidth = 120,
		indent = 'tab',
		indentSize = 4,
		trailingComma = 'es5',
		bracketSpacing = true,
		bracketSameLine = true,
		arrowParens = 'avoid',
		endOfLine = 'lf',
		singleAttributePerLine = false,
		quoteProps = 'as-needed',
		format = 'prettier',
	} = typeof options === 'object' ? options : {};

	const configs: TypedFlatConfigItem[] = [];

	const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));
	const pluginStylisticOptions: StylisticCustomizeOptions = {
		arrowParens: format ? false : Boolean(arrowParens),
		blockSpacing: bracketSpacing,
		braceStyle,
		quotes,
		semi: semicolons,
		indent: indent === 'tab' ? 'tab' : indentSize,
		jsx: true,
		commaDangle: trailingComma === 'es5' ? 'only-multiline' : trailingComma === 'none' ? 'never' : 'always',
		quoteProps: quoteProps === 'preserve' ? 'as-needed' : quoteProps,
	};

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
			semi: semicolons,
			parser: typescript ? 'typescript' : 'babel',
			singleQuote: quotes === 'single',
			jsxSingleQuote: quotes === 'single',
			printWidth,
			useTabs: indent === 'tab',
			tabWidth: indentSize,
			trailingComma,
			bracketSpacing,
			bracketSameLine,
			arrowParens,
			endOfLine,
			singleAttributePerLine,
			quoteProps,
		};

		configs.push({
			name: `${STYLISTIC_CONFIG_NAME}/prettier`,
			files: typescript ? SOURCE_GLOBS : JAVASCRIPT_GLOBS,
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
