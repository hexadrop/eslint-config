import type { VendoredPrettierOptions } from '../../types';

interface OptionsFormatters {
	/**
	 * Enable formatting support for Astro.
	 *
	 * Currently only support Prettier.
	 */
	astro?: 'prettier' | boolean;

	/**
	 * Enable formatting support for CSS, Less, Sass, and SCSS.
	 *
	 * Currently only support Prettier.
	 */
	css?: 'prettier' | boolean;

	/**
	 * Enable formatting support for HTML.
	 *
	 * Currently only support Prettier.
	 */
	html?: 'prettier' | boolean;

	/**
	 * Enable formatting support for Markdown.
	 *
	 * When set to `true`, it will use Prettier.
	 */
	markdown?: 'prettier' | boolean;

	/**
	 * Custom options for Prettier.
	 *
	 * By default, it's controlled by our own config.
	 */
	prettierOptions?: VendoredPrettierOptions;
}

interface FormattersOptions {

	/**
	 * Use external formatters to format files.
	 *
	 * Requires installing:
	 * - `eslint-plugin-format`
	 *
	 * When set to `true`, it will enable all formatters.
	 *
	 * @default false
	 */
	formatters?: OptionsFormatters | boolean;
}

export type { FormattersOptions, OptionsFormatters };
