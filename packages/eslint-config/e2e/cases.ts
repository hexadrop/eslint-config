import type { RecursivePartial } from '@hexadrop/eslint-config-shared';

import type { HexadropEslintOptions } from '../src/options';
import type { TypedFlatConfigItem } from '../src/types';

interface EndToEndCase {
	extraConfigs?: TypedFlatConfigItem[];
	/**
	 * Dirty fixture file at e2e/fixtures/<file>. The file name is part of
	 * the behavior under test: `package.json` and `tsconfig.json` activate
	 * filename-scoped rules such as the canonical key ordering.
	 */
	file: string;
	options?: RecursivePartial<HexadropEslintOptions>;
	slug: string;
}

const DEFAULTS: RecursivePartial<HexadropEslintOptions> = { astro: false, react: false, typescript: true };

/**
 * End-to-end scenarios over real fixture files, following the strategy of
 * antfu/eslint-config: each fixture is a dirty file of a supported type that
 * the config is run against with `fix` enabled. Two snapshots are frozen per
 * file: the diagnostics that survive autofix (unfixable rules such as
 * no-console) and the resulting file content, which pins the formatting
 * behavior of `eslint --fix` against regressions.
 */
export const END_TO_END_CASES: EndToEndCase[] = [
	{
		file: 'clean.ts',
		options: DEFAULTS,
		slug: 'clean',
	},
	{
		extraConfigs: [{ name: 'consumer/rule-override', rules: { quotes: ['error', 'double'] } }],
		file: 'rule-override.ts',
		options: DEFAULTS,
		slug: 'rule-override',
	},
	{
		file: 'no-console.ts',
		options: DEFAULTS,
		slug: 'no-console',
	},
	{
		file: 'typescript.ts',
		options: DEFAULTS,
		slug: 'typescript',
	},
	{
		file: 'javascript.js',
		options: { astro: false, react: false, typescript: false },
		slug: 'javascript',
	},
	{
		file: 'file.json',
		options: DEFAULTS,
		slug: 'json',
	},
	{
		file: 'package.json',
		options: DEFAULTS,
		slug: 'package-json',
	},
	{
		file: 'tsconfig.json',
		options: DEFAULTS,
		slug: 'tsconfig-json',
	},
	{
		file: 'markdown.md',
		options: DEFAULTS,
		slug: 'markdown',
	},
	{
		// `version: 'detect'` cannot resolve react from fixture dirs, so the version is pinned.
		extraConfigs: [{ name: 'e2e/react-version', settings: { react: { version: '19' } } }],
		file: 'react.tsx',
		options: { astro: false, react: true, typescript: true },
		slug: 'tsx',
	},
	{
		file: 'astro.astro',
		options: { astro: true, react: false, typescript: true },
		slug: 'astro',
	},
	{
		file: 'stylistic-off.ts',
		options: { astro: false, react: false, stylistic: false, typescript: true },
		slug: 'stylistic-off',
	},
];

export type { EndToEndCase };
