import type { IgnoreOptions } from '../config';

export interface HexatoolEslintOptions {

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
