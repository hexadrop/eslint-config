import type { EndToEndCase } from '@hexadrop/eslint-config-shared';

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
];

export { type EndToEndCase } from '@hexadrop/eslint-config-shared';
