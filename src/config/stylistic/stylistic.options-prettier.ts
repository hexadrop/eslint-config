import type { StylisticOptions, StylisticOptionsObject } from './stylistic.options';

export default function prettierOptions(options: StylisticOptions = true): Required<StylisticOptionsObject> {
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

	return {
		arrowParens,
		braceStyle,
		bracketSameLine,
		bracketSpacing,
		endOfLine,
		format,
		indent,
		indentSize,
		printWidth,
		quoteProps,
		quotes,
		semicolons,
		singleAttributePerLine,
		sort,
		trailingComma,
	};
}
