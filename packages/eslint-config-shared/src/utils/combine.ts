import type { Awaitable } from '../types';
import type { TypedFlatConfigItem } from '../types/typed-flat-config-item';

/**
 * Combine array and non-array configs into a single array.
 */
export default async function combine<RuleOptionsType>(
	...configs: Awaitable<TypedFlatConfigItem<RuleOptionsType> | TypedFlatConfigItem<RuleOptionsType>[]>[]
): Promise<TypedFlatConfigItem<RuleOptionsType>[]> {
	const resolved = await Promise.all(configs.map(config => Promise.resolve(config)));

	return resolved.flat();
}
