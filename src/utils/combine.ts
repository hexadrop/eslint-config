import type { Awaitable, TypedFlatConfigItem } from '../types';

/**
 * Combine array and non-array configs into a single array.
 */
export default async function combine(...configs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]): Promise<TypedFlatConfigItem[]> {
	const resolved = await Promise.all(configs)
	return resolved.flat()
}
