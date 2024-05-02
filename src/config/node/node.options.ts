import type { TypedFlatConfigItem } from '../../types';

interface NodeOptionsObject {
	/**
	 * Overrides for rules.
	 */
	overrides: TypedFlatConfigItem['rules'];
}

export type NodeOptions = boolean | NodeOptionsObject;
