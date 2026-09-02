import type { Awaitable, TypedFlatConfigItem } from '../types';

/**
 * Combine array and non-array configs into a single array.
 */
export default async function combine<Config = unknown>(
	...configs: Awaitable<TypedFlatConfigItem<Config> | TypedFlatConfigItem<Config>[]>[]
): Promise<TypedFlatConfigItem<Config>[]> {
	const resolved = await Promise.all(configs.map(config => Promise.resolve(config)));

	return resolved.flat();
}
