import { isPackageExists } from 'local-pkg';

import type { ResolvedStylisticFactoryOptions, StylisticFactoryOptions } from './stylistic.options';

/**
 * Resolve an optional peer section: an explicit option always wins, otherwise
 * the sibling package presence enables the section. Requesting a section whose
 * peer is missing fails with an actionable message instead of silently
 * producing rules for an unregistered plugin.
 */
function isFeatureEnabled(option: boolean | undefined, packageName: string, optionKey: string): boolean {
	if (option === undefined) {
		return isPackageExists(packageName);
	}

	if (option && !isPackageExists(packageName)) {
		throw new Error(
			`${packageName} is required when ${optionKey} is enabled. ` +
				`Install it with your package manager or set ${optionKey}: false to disable it.`
		);
	}

	return option;
}

/**
 * Resolve the stylistic factory options with defaults.
 *
 * Optional peers that are neither enabled nor disabled are auto-detected from
 * the presence of their sibling package.
 */
export default function resolveOptions(options: StylisticFactoryOptions = {}): ResolvedStylisticFactoryOptions {
	if (options.stylistic === false) {
		return {
			astro: false,
			format: false,
			isTypeAware: false,
			json: false,
			markdown: false,
			perfectionist: false,
			stylistic: false,
			typescript: false,
			unicorn: false,
		};
	}

	return {
		astro: isFeatureEnabled(options.astro, '@hexadrop/eslint-config-astro', 'astro'),
		format: options.format ?? true,
		isTypeAware: options.isTypeAware ?? false,
		json: isFeatureEnabled(options.json, '@hexadrop/eslint-config-json', 'json'),
		markdown: options.markdown ?? false,
		perfectionist: options.perfectionist ?? true,
		stylistic: {
			arrowParens: options.stylistic?.arrowParens ?? 'avoid',
			braceStyle: options.stylistic?.braceStyle ?? '1tbs',
			bracketSameLine: options.stylistic?.bracketSameLine ?? true,
			bracketSpacing: options.stylistic?.bracketSpacing ?? true,
			endOfLine: options.stylistic?.endOfLine ?? 'lf',
			indent: options.stylistic?.indent ?? 'tab',
			indentSize: options.stylistic?.indentSize ?? 4,
			printWidth: options.stylistic?.printWidth ?? 120,
			quoteProps: options.stylistic?.quoteProps ?? 'as-needed',
			quotes: options.stylistic?.quotes ?? 'single',
			semicolons: options.stylistic?.semicolons ?? true,
			singleAttributePerLine: options.stylistic?.singleAttributePerLine ?? true,
			trailingComma: options.stylistic?.trailingComma ?? 'es5',
		},
		typescript: isFeatureEnabled(options.typescript, '@hexadrop/eslint-config-typescript', 'typescript'),
		unicorn: options.unicorn ?? true,
	};
}
