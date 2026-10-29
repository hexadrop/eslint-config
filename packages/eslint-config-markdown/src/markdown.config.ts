import { GLOB_MARKDOWN, GLOB_MARKDOWN_IN_MARKDOWN } from '@hexadrop/eslint-config-core';
import {
	interopDefault,
	MARKDOWN_CONFIG_NAME_SETUP,
	MARKDOWN_CONFIG_NAME_SETUP_PARSER,
	MARKDOWN_CONFIG_NAME_SETUP_PROCESSOR,
} from '@hexadrop/eslint-config-shared';
import type { Linter } from 'eslint';
import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors';
import { meta, parseForESLint } from 'eslint-parser-plain';

import type { TypedFlatConfigItem } from './markdown.typed-config';

export default async function markdownConfig(): Promise<TypedFlatConfigItem[]> {
	const pluginMarkdown = await interopDefault(import('@eslint/markdown'));
	const processors = pluginMarkdown.processors;
	const processor = processors.markdown;

	return [
		{
			name: MARKDOWN_CONFIG_NAME_SETUP,
			plugins: {
				markdown: pluginMarkdown,
			},
		},
		{
			files: GLOB_MARKDOWN,
			ignores: GLOB_MARKDOWN_IN_MARKDOWN,
			name: MARKDOWN_CONFIG_NAME_SETUP_PROCESSOR,
			/*
			 * `@eslint/markdown` only emits code-block virtual files; the pass-through
			 * processor keeps the markdown file itself lintable.
			 */
			processor: mergeProcessors([processor, processorPassThrough] as Linter.Processor[]),
		},
		{
			files: GLOB_MARKDOWN,
			languageOptions: {
				parser: {
					meta,
					parseForESLint,
				},
			},
			name: MARKDOWN_CONFIG_NAME_SETUP_PARSER,
		},
	];
}
