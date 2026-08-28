import type { Linter } from 'eslint';

import type { RuleOptions } from '../typegen';

export type TypedFlatConfigItem = Linter.Config & {
	/**
	 * Custom name of each config item
	 */
	name?: string;

	/**
	 * An object containing a name-value mapping of rules to use.
	 */
	rules?: Linter.RulesRecord & RuleOptions;
};
