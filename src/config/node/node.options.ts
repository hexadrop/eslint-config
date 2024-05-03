import type { PickRules, TypedFlatConfigItem } from '../../types';

interface NodeOptionsObject {
	/**
	 * Overrides for rules.
	 */
	overrides: PickRules<TypedFlatConfigItem['rules'], 'node'>;
}

export type NodeOptions = boolean | NodeOptionsObject;
