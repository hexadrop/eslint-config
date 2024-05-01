import type { CoreOptions, IgnoreOptions } from '../config';

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
	 * @default true
	 */
	ignore?: IgnoreOptions;

	/**
	 * Automatically rename plugins in the config.
	 *
	 * @default true
	 */
	renamePlugins?: false | Record<string, string>;
}
