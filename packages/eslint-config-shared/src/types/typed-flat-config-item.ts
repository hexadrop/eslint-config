import type { Linter } from 'eslint';

export type TypedFlatConfigItem<RuleOptionsType> = Linter.Config & {
	name?: string;

	rules?: Linter.RulesRecord & RuleOptionsType;
};
