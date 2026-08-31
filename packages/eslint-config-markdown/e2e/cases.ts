import type { HexadropEslintMarkdownOptions } from '../src';

interface EndToEndCase {
	/**
	 * Markdown fixture file at e2e/fixtures/<file>. The markdown slice ships no
	 * rules of its own: the processor and the plain parser decide which virtual
	 * files reach the linter and what diagnostics survive.
	 */
	file: string;
	options?: HexadropEslintMarkdownOptions;
	slug: string;
}

/**
 * End-to-end scenarios over real fixture files, mirroring the strategy of
 * packages/eslint-config-json (in turn following packages/eslint-config): each
 * fixture is run through the real ESLint engine with `fix` enabled. Two
 * snapshots are frozen per file: the diagnostics that survive and the
 * resulting file content, pinning the processor + parser-plain wiring against
 * regressions.
 */
export const END_TO_END_CASES: EndToEndCase[] = [
	{
		file: 'markdown.md',
		slug: 'markdown',
	},
	{
		file: 'disabled.md',
		options: { markdown: false },
		slug: 'disabled',
	},
];

export type { EndToEndCase };
