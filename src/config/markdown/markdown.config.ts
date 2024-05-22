import type { ESLint, Linter } from 'eslint';
import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors';
import { parseForESLint } from 'eslint-parser-plain';

import type { HexadropEslintOptions } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import {
	MARKDOWN_CONFIG_NAME_SETUP,
	MARKDOWN_CONFIG_NAME_SETUP_PARSER,
	MARKDOWN_CONFIG_NAME_SETUP_PROCESSOR,
} from './markdown.config-name';
import { GLOB_MARKDOWN, GLOB_MARKDOWN_IN_MARKDOWN } from './markdown.globs';

export default async function markdown(options: HexadropEslintOptions): Promise<TypedFlatConfigItem[]> {
	const { markdown } = options;
	if (!markdown) {
		return [];
	}
	const pluginMarkdown = (await interopDefault(import('eslint-plugin-markdown'))) as ESLint.Plugin;
	const processors = pluginMarkdown.processors;
	const processor = processors?.['markdown'];

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
			name: MARKDOWN_CONFIG_NAME_SETUP_PARSER,
		},
	];
}
