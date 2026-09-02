import type { Linter } from 'eslint';

export type TypedFlatConfigItem<RuleOptionsType> = Linter.Config & {
	/**
	 * Custom name of each config item
	 */
	name?: string;

	/**
	 * An object containing a name-value mapping of rules to use.
	 */
	rules?: Linter.RulesRecord & RuleOptionsType;
};
