import type { PickRules, TypedFlatConfigItem } from '../../types';

interface ImportsOptionsObject {
	/*
	 * Enable AMD support.
	 *
	 * @see https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-amd.md
	 * @default false
	 */
	amd?: boolean;

	/*
	 * Enable CommonJS support.
	 *
	 * @see https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-commonjs.md
	 * @default false
	 */
	commonjs?: boolean;

	/**
	 * Overrides for rules.
	 */
	overrides?: PickRules<TypedFlatConfigItem['rules'], 'import' | 'import-sort' | 'import-unused'>;

	/**
	 * Enable removing unused imports.
	 *
	 * @see https://github.com/sweepline/eslint-plugin-unused-imports
	 * @default true
	 */
	removeUnused?: boolean;

	/**
	 * Enable sorting rules.
	 *
	 * @see https://github.com/lydell/eslint-plugin-simple-import-sort
	 * @default true
	 */
	sort?: boolean;

	/**
	 * Enable stylistic rules.
	 *
	 * @default true
	 */
	stylistic?: boolean;

	/**
	 * Enable help warning rules.
	 *
	 * @see https://github.com/un-ts/eslint-plugin-import-x?tab=readme-ov-file#helpful-warnings
	 * @default true
	 */
	warnings?: boolean;

	/**
	 * Enable webpack support.
	 *
	 * @default false
	 */
	webpack?: boolean;
}

export type ImportsOptions = boolean | ImportsOptionsObject;
