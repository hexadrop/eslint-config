import type { TypedFlatConfigItem } from '../../types';

interface TypescriptOptionsObject {
	/**
	 * Overrides for rules.
	 */
	overrides: TypedFlatConfigItem['rules'];
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
	tsconfigPath?: false | string | string[];
}

export type TypescriptOptions = boolean | TypescriptOptionsObject;
