import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';

import type { OptionsOverrides } from './options-override';

type StylisticConfig = {
	lineLength?: number;
} & Omit<StylisticCustomizeOptions, 'flat' | 'pluginName'>;

interface StylisticOptions {

	/**
	 * Enable stylistic rules.
	 *
	 * @default true
	 */
	stylistic?: (OptionsOverrides & StylisticConfig) | boolean;
}

export type { StylisticConfig, StylisticOptions };
