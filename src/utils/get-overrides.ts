import type { HexatoolEslintOptions } from '../options';
import resolveSubOptions from './resolve-sub-options';

export default function getOverrides<K extends keyof HexatoolEslintOptions>(
	options: HexatoolEslintOptions,
	key: K,
) {
	const sub = resolveSubOptions(options, key)
	return {
		...'overrides' in sub
			? sub.overrides
			: {},
	}
}
