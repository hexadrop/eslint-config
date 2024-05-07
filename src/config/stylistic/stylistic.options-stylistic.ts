import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';

import type { StylisticOptionsObject } from './stylistic.options';

export default function stylisticOptions(options: Required<StylisticOptionsObject>): StylisticCustomizeOptions {
	const {
		arrowParens,
		braceStyle,
		bracketSpacing,
		format,
		indent,
		indentSize,
		quoteProps,
		quotes,
		semicolons,
		trailingComma,
	} = options;

	return {
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
}
