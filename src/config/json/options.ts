import type { OptionsOverrides } from '../../options';

export interface JsonOptions {
	/**
	 * Enable JSONC support.
	 *
	 * @default true
	 */
	json?: false | OptionsOverrides;
}
