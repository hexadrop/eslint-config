import type { OptionsOverrides } from '../../options';

export interface UnicornOptions {
	/**
	 * Enable unicorn plugin for props and items sorting.
	 *
	 * @see https://github.com/sindresorhus/eslint-plugin-unicorn
	 *
	 * @default true
	 */
	unicorn?: OptionsOverrides | false;
}
