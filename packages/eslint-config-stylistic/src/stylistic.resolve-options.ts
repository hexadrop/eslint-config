import type { RecursivePartial } from '@hexadrop/eslint-config-shared';

import type { StylisticFactoryOptions } from './stylistic.options';

/**
 * Resolve the stylistic factory options with defaults.
 */
export default function resolveOptions(
	options: RecursivePartial<StylisticFactoryOptions> = {}
): StylisticFactoryOptions {
	return {
		astro: options.astro ?? false,
		isTypeAware: options.isTypeAware ?? false,
		json: options.json ?? false,
		markdown: options.markdown ?? false,
		typescript: options.typescript ?? false,
		stylistic:
			options.stylistic === false
				? false
				: {
						arrowParens: options.stylistic?.arrowParens ?? 'avoid',
						braceStyle: options.stylistic?.braceStyle ?? '1tbs',
						bracketSameLine: options.stylistic?.bracketSameLine ?? true,
						bracketSpacing: options.stylistic?.bracketSpacing ?? true,
						endOfLine: options.stylistic?.endOfLine ?? 'lf',
						format: options.stylistic?.format ?? true,
						imports: options.stylistic?.imports ?? true,
						indent: options.stylistic?.indent ?? 'tab',
						indentSize: options.stylistic?.indentSize ?? 4,
						perfectionist: options.stylistic?.perfectionist ?? true,
						printWidth: options.stylistic?.printWidth ?? 120,
						quoteProps: options.stylistic?.quoteProps ?? 'as-needed',
						quotes: options.stylistic?.quotes ?? 'single',
						semicolons: options.stylistic?.semicolons ?? true,
						singleAttributePerLine: options.stylistic?.singleAttributePerLine ?? true,
						trailingComma: options.stylistic?.trailingComma ?? 'es5',
						unicorn: options.stylistic?.unicorn ?? true,
					},
	} satisfies StylisticFactoryOptions;
}