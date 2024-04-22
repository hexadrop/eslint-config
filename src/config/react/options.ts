import type { OptionsOverrides } from '../../options';

export interface ReactOptions {

	/**
	 * Enable react rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-react`
	 * - `eslint-plugin-react-hooks`
	 * - `eslint-plugin-react-refresh`
	 *
	 * @default Detect if `react` is installed
	 */
	react?: OptionsOverrides | boolean;
}
