import type { ESLint } from 'eslint';
import { Linter } from 'eslint';
import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors';
import { parseForESLint } from 'eslint-parser-plain';

import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import { GLOB_MARKDOWN, GLOB_MARKDOWN_IN_MARKDOWN } from './markdown.globs';
import type { MarkdownOptions } from './markdown.options';

const MARKDOWN_CONFIG_NAME = 'hexatool/markdown';

export default async function markdown(options: MarkdownOptions = true): Promise<TypedFlatConfigItem[]> {
	if (!options) {
		return [];
	}

	const markdown = (await interopDefault(import('eslint-plugin-markdown'))) as ESLint.Plugin;
	const processors = markdown.processors;
	const processor = processors?.['markdown'];

	return [
		{
			name: `${MARKDOWN_CONFIG_NAME}/setup`,
			plugins: {
				markdown,
			},
		},
		{
			files: GLOB_MARKDOWN,
			ignores: GLOB_MARKDOWN_IN_MARKDOWN,
			name: `${MARKDOWN_CONFIG_NAME}/processor`,
			plugins: {
				markdown,
			},
			/*
			 * `eslint-plugin-markdown` only creates virtual files for code blocks,
			 * but not the markdown file itself. We use `eslint-merge-processors` to
			 * add a pass-through processor for the markdown file itself.
			 */
			processor: mergeProcessors([processor, processorPassThrough] as Linter.Processor[]),
		},
		{
			files: GLOB_MARKDOWN,
			languageOptions: {
				parser: {
					parseForESLint,
				},
			},
			name: `${MARKDOWN_CONFIG_NAME}/parser`,
		},
		{
			files: GLOB_MARKDOWN,
			name: `${MARKDOWN_CONFIG_NAME}/rules/disable`,
			rules: {
				'unicorn/filename-case': 'off',
			},
		},
	];
}
