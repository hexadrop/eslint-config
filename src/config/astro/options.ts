import type { OptionsOverrides } from '../../options';

export interface AstroOptions {
	/**
	 * Enable ASTRO support.
	 *
	 * Requires installing:
	 * - `eslint-plugin-astro`
	 *
	 * Requires installing for formatting .astro:
	 * - `prettier-plugin-astro`
	 *
	 * @default Detect if `astro` is installed
	 */
	astro?: OptionsOverrides | boolean;
}
