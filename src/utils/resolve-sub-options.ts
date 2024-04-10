import type { ResolvedOptions } from '../types';
import type { HexatoolEslintOptions } from '../options';

export default function resolveSubOptions<K extends keyof HexatoolEslintOptions>(
	options: HexatoolEslintOptions,
	key: K,
): ResolvedOptions<HexatoolEslintOptions[K]> {
	return typeof options[key] === 'boolean'
		? {} as any
		: options[key] || {}
}
