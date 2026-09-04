import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';

import type { HexadropEslintStylisticOptions } from '../../options';

export default function stylisticOptions(options: HexadropEslintStylisticOptions): StylisticCustomizeOptions {
	const {
		arrowParens,
		braceStyle,
		bracketSpacing,
		indent,
		indentSize,
		quoteProps,
		quotes,
		semicolons,
		trailingComma,
	} = options;

	return {
		arrowParens: arrowParens === 'always',
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
