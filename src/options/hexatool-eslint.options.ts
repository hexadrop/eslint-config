import type { CoreOptions, IgnoreOptions, ImportsOptions, NodeOptions, StylisticOptions,TypescriptOptions  } from '../config';

export interface HexatoolEslintOptions {
	/**
	 * Core rules. Can't be disabled.
	 */
	core?: CoreOptions;

	/**
	 * Enable gitignore support.
	 *
	 * Passing an object to configure the options.
	 *
	 * @see https://github.com/antfu/eslint-config-flat-gitignore
	 *
	 * @default true
	 */
	ignore?: IgnoreOptions;

	/**
	 * Enable imports rules.
	 *
	 * Passing an object to configure the options.
	 *
	 * @see https://github.com/import-js/eslint-plugin-import
	 * @see https://github.com/lydell/eslint-plugin-simple-import-sort
	 * @see https://github.com/sweepline/eslint-plugin-unused-imports
	 *
	 * @default true
	 */
	imports?: ImportsOptions;

	/**
	 * Enable node rules.
	 *
	 * Passing an object to configure the options.
	 *
	 * @default true
	 */
	node?: NodeOptions;

	/**
	 * Enable stylistic rules.
	 *
	 * Passing an object to configure the options.
	 *
	 * @default true
	 */
	stylistic?: StylisticOptions;

	/**
	 * Enable typescript rules.
	 *
	 * Passing an object to configure the options. If `typescript` is not set, it will automatically detect if
	 * `typescript` is installed.
	 */
	typescript?: TypescriptOptions;
}
