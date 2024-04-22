import type { OptionsOverrides } from '../../options';

export interface PerfectionistOptions {
	/**
	 * Enable perfectionist plugin for props and items sorting.
	 *
	 * @see https://github.com/azat-io/eslint-plugin-perfectionist
	 *
	 * @default true
	 */
	perfectionist?: OptionsOverrides | false;
}
