export interface HexatoolEslintModulesOptions {
	/*
	 * Enable AMD support.
	 *
	 * @default false
	 */
	amd: boolean;

	/*
	 * Enable CommonJS support.
	 *
	 * @default false
	 */
	commonjs: boolean;

	/*
	 * Ignore node modules to prevent `import/no-unresolved` false positives.
	 */
	ignore: string[];

	/**
	 * Enable use of core node modules.
	 *
	 * @default true
	 */
	node: boolean;

	/**
	 * Enable webpack support.
	 *
	 * @default false
	 */
	webpack: boolean;
}
