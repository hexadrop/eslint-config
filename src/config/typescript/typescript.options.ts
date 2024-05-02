import type { TypedFlatConfigItem } from '../../types';

interface TypescriptOptionsObject {
	/**
	 * Overrides for rules.
	 */
	overrides: TypedFlatConfigItem['rules'];

	/**
	 * When these options are provided, type aware rules will be enabled.
	 * @see https://typescript-eslint.io/linting/typed-linting/
	 */
	tsconfigPath?: false | string | string[];
}

export type TypescriptOptions = boolean | TypescriptOptionsObject;
