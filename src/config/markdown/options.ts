import type { OptionsOverrides } from '../../options';

export interface MarkdownOptions {

	/**
	 * Enable linting for **code snippets** in Markdown.
	 *
	 * For formatting Markdown content, enable also `formatters.markdown`.
	 *
	 * @default true
	 */
	markdown?: OptionsOverrides | boolean;
}
