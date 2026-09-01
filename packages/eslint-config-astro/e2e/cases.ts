import type { Linter } from 'eslint';

import type { HexadropEslintAstroOptions } from '../src';

interface EndToEndCase {
	extraConfigs?: Linter.Config[];
	/**
	 * Astro fixture file at e2e/fixtures/<file>.
	 */
	file: string;
	options?: HexadropEslintAstroOptions;
	slug: string;
}

/**
 * End-to-end scenarios over real fixture files, mirroring the strategy of
 * packages/eslint-config-react (in turn following packages/eslint-config-markdown,
 * packages/eslint-config-json and packages/eslint-config): each fixture is run
 * through the real ESLint engine with `fix` enabled. Two snapshots are frozen
 * per file: the diagnostics that survive and the resulting file content,
 * pinning the rule wiring against regressions.
 *
 * `@hexadrop/eslint-config-typescript` is not installed in this repository, so
 * the optional peer is absent and only the js-only parsing path can run end to
 * end here.
 */
export const END_TO_END_CASES: EndToEndCase[] = [
	{
		file: 'astro.astro',
		options: { typescript: false },
		slug: 'astro',
	},
	{
		file: 'disabled.astro',
		options: { astro: false, typescript: false },
		slug: 'disabled',
	},
];

export type { EndToEndCase };
