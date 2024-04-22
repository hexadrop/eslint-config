import { Linter } from 'eslint';
import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors';

import type { TypedFlatConfigItem } from '../../types';
import { interopDefault, parserPlain } from '../../utils';
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from './globs';
import type { MarkdownOptions } from './options';

export default async function markdown(
	options: MarkdownOptions['markdown'] = true,
): Promise<TypedFlatConfigItem[]> {
	if (!options) {
		return [];
	}

	// eslint-disable-next-line typescript/no-unsafe-assignment
	const markdown = await interopDefault(import('eslint-plugin-markdown'));

	const {
		overrides = {},
	} = typeof options === 'boolean' ? {} : options;

	const files = [GLOB_MARKDOWN];

	return [
		{
			name: 'hexatool/markdown/setup',
			plugins: {
				// eslint-disable-next-line typescript/no-unsafe-assignment
				markdown,
			},
		},
		{
			files,
			ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
			name: 'hexatool/markdown/processor',
			/*
			 * `eslint-plugin-markdown` only creates virtual files for code blocks,
			 * but not the markdown file itself. We use `eslint-merge-processors` to
			 * add a pass-through processor for the markdown file itself.
			 */

			processor: mergeProcessors([
				// eslint-disable-next-line typescript/no-unsafe-member-access
				markdown.processors.markdown,
				processorPassThrough,
			] as Linter.Processor[]),
		},
		{
			files,
			languageOptions: {
				parser: parserPlain,
			},
			name: 'hexatool/markdown/parser',
		},
		{
			files: [GLOB_MARKDOWN],
			name: 'hexatool/markdown/disables',
			rules: {
				'style/no-mixed-spaces-and-tabs': 'off',
				'unicorn/filename-case': 'off',

				...overrides,
			},
		},
		{
			files: GLOB_MARKDOWN_CODE,
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						impliedStrict: true,
					},
				},
			},
			name: 'hexatool/markdown/code/disables',
			rules: {
				'import/default': 'off',
				'line-comment-position': 'off',
				'no-inline-comments': 'off',
				'unicorn/filename-case': 'off',

				...overrides,
			},
		},
	];
}
