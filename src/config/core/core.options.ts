import type { TypedFlatConfigItem } from '../../types';

export interface CoreOptions {
	/*
	 * Enable AMD support.
	 *
	 * @default false
	 */
	amd?: boolean;

	/*
	 * Enable CommonJS support.
	 *
	 * @default false
	 */
	commonjs?: boolean;

	/**
	 * Overrides for rules.
	 */
	overrides?: TypedFlatConfigItem['rules'];

	/**
	 * Enable use of core node modules.
	 *
	 * @default true
	 */
	node?: boolean;

	/**
	 * Enable webpack support.
	 *
	 * @default false
	 */
	webpack?: boolean;
}
