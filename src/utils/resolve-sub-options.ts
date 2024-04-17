import type { HexatoolEslintOptions } from '../options';
import type { ResolvedOptions } from '../types';

export default function resolveSubOptions<K extends keyof HexatoolEslintOptions>(
	options: HexatoolEslintOptions,
	key: K,
): ResolvedOptions<HexatoolEslintOptions[K]> {
	// eslint-disable-next-line typescript/no-unsafe-return
	return typeof options[key] === 'boolean'
		// eslint-disable-next-line typescript/no-explicit-any
		? {} as any
		: options[key] || {};
}
