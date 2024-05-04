interface TypescriptOptionsObject {
	/**
	 * Enable stylistic rules.
	 *
	 * @default true
	 */
	stylistic?: boolean;

	/**
	 * When these options are provided, type aware rules will be enabled.
	 * @see https://typescript-eslint.io/linting/typed-linting/
	 *
	 * @default Detects automatically `tsconfig.json` in the project root.
	 */
	tsconfig?: false | string | string[];
}

export type TypescriptOptions = boolean | TypescriptOptionsObject;
