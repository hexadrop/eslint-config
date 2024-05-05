import type { RequiredOptions } from 'prettier';

import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
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
	} = typeof options === 'object' ? options : {};

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

	const configs: TypedFlatConfigItem[] = [];

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

	return configs;
}
