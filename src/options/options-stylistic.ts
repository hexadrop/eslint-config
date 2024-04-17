import type { OptionsOverrides } from './options-override';

export interface StylisticConfig  {

}
export interface StylisticOptions {

	/**
	 * Enable stylistic rules.
	 *
	 * @default true
	 */
	stylistic?: boolean | (StylisticConfig & OptionsOverrides)
}
