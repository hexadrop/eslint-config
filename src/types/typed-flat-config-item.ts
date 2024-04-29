import type { Linter } from 'eslint';

import type { RuleOptions } from '../typegen';

type Rules = RuleOptions;

export type TypedFlatConfigItem = {
	/**
	 * Custom name of each config item
	 */
	name?: string;

	/**
	 * An object containing a name-value mapping of rules to use.
	 */
	rules?: Linter.RulesRecord & Rules;
} & Linter.FlatConfig;
