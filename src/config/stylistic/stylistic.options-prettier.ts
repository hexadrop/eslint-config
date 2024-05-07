import type { StylisticOptionsObject } from './stylistic.options';

interface PrettierOptions {
	[k: string]: unknown;
	parser?: string;
}

export default function prettierOptions(options: Required<StylisticOptionsObject>): PrettierOptions {
	const {
		arrowParens,
		bracketSameLine,
		bracketSpacing,
		endOfLine,
		indent,
		indentSize,
		printWidth,
		quoteProps,
		quotes,
		semicolons,
		singleAttributePerLine,
		trailingComma,
	} = options;

	return {
		arrowParens,
		bracketSameLine,
		bracketSpacing,
		endOfLine,
		jsxSingleQuote: quotes === 'single',
		printWidth,
		quoteProps,
		semi: semicolons,
		singleAttributePerLine,
		singleQuote: quotes === 'single',
		tabWidth: indentSize,
		trailingComma,
		useTabs: indent === 'tab',
	};
}
