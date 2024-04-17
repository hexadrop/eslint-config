import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';

import type { OptionsOverrides } from './options-override';

type StylisticConfig = Omit<StylisticCustomizeOptions, 'pluginName' | 'flat'> & {
	lineLength?: number;
};

interface StylisticOptions {

	/**
	 * Enable stylistic rules.
	 *
	 * @default true
	 */
	stylistic?: boolean | (StylisticConfig & OptionsOverrides);
}

export type { StylisticConfig, StylisticOptions };
