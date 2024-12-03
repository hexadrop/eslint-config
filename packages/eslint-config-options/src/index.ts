import type { HexadropEslintIgnoreOptions } from '@hexadrop/eslint-config-ignore';

interface HexadropEslintConfigOptions {

	/**
	 * Enable ignore support.
	 *
	 * Passing an object to configure the options.
	 *
	 * @see https://github.com/antfu/eslint-config-flat-gitignore
	 *
	 * @default true
	 */
	ignore: HexadropEslintIgnoreOptions;
}

export type { HexadropEslintConfigOptions };
