import type { TypedFlatConfigItem } from '../../types';

interface TypescriptOptionsObject {
	/**
	 * Overrides for rules.
	 */
	overrides: TypedFlatConfigItem['rules'];
}

export type TypescriptOptions = boolean | TypescriptOptionsObject;
