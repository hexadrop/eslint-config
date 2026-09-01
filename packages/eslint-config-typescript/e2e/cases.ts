import type { HexadropEslintTypescriptOptions, TypedFlatConfigItem } from '../src';

interface EndToEndCase {
	extraConfigs?: TypedFlatConfigItem[];
	file: string;
	options?: HexadropEslintTypescriptOptions;
	slug: string;
}

/**
 * End-to-end scenarios over real fixture files. Each fixture is a typescript
 * file that the standalone config is run against with `fix` enabled. Two
 * snapshots are frozen per file: the diagnostics that survive autofix and the
 * resulting file content.
 */
export const END_TO_END_CASES: EndToEndCase[] = [
	{
		file: 'clean.ts',
		options: { typescript: true },
		slug: 'clean',
	},
	{
		file: 'typescript.ts',
		options: { typescript: true },
		slug: 'typescript',
	},
	{
		file: 'no-console.ts',
		options: { typescript: true },
		slug: 'no-console',
	},
	{
		file: 'disabled.ts',
		options: { typescript: false },
		slug: 'disabled',
	},
];

export type { EndToEndCase };
