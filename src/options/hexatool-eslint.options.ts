export interface HexatoolEslintOptions {
	/**
	 * Automatically rename plugins in the config.
	 *
	 * @default true
	 */
	renamePlugins?: false | Record<string, string>;
}
