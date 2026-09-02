import type { RecursivePartial } from '@hexadrop/eslint-config-shared';

import type { HexadropEslintOptions } from '../../src/options';
import type { TypedFlatConfigItem } from '../../src/types';

interface MatrixCell {
	description: string;
	extraConfigs?: TypedFlatConfigItem[];
	options: RecursivePartial<HexadropEslintOptions>;
	slug: string;
}

/**
 * Every explicit option combination whose resolved config is frozen by golden
 * snapshots. Options are always stated explicitly so snapshots never depend on
 * the environment the test runner happens to execute in.
 */
const MATRIX: MatrixCell[] = [
	{
		description: 'every feature disabled',
		options: {
			astro: false,
			ignore: false,
			imports: false,
			json: false,
			markdown: false,
			node: false,
			react: false,
			stylistic: false,
			typescript: false,
		},
		slug: 'all-off',
	},
	{
		description: 'defaults on a plain javascript project',
		options: {
			astro: false,
			react: false,
			typescript: false,
		},
		slug: 'defaults-js',
	},
	{
		description: 'defaults on a typescript project',
		options: {
			astro: false,
			react: false,
			typescript: true,
		},
		slug: 'defaults-ts',
	},
	{
		description: 'typescript with an explicit tsconfig path list',
		options: {
			astro: false,
			react: false,
			typescript: ['tsconfig.json', 'tsconfig.eslint.json'],
		},
		slug: 'tsconfig-paths',
	},
	{
		description: 'react without typescript',
		options: {
			astro: false,
			react: true,
			typescript: false,
		},
		slug: 'react-js',
	},
	{
		description: 'react with typescript',
		options: {
			astro: false,
			react: true,
			typescript: true,
		},
		slug: 'react-ts',
	},
	{
		description: 'astro without typescript',
		options: {
			astro: true,
			react: false,
			typescript: false,
		},
		slug: 'astro-js',
	},
	{
		description: 'astro with typescript',
		options: {
			astro: true,
			react: false,
			typescript: true,
		},
		slug: 'astro-ts',
	},
	{
		description: 'full stack: astro, react and typescript',
		options: {
			astro: true,
			react: true,
			typescript: true,
		},
		slug: 'astro-react-ts',
	},
	{
		description: 'stylistic with formatting disabled',
		options: {
			astro: false,
			react: false,
			stylistic: { format: false },
			typescript: true,
		},
		slug: 'stylistic-no-format',
	},
	{
		description: 'stylistic with unicorn disabled',
		options: {
			astro: false,
			react: false,
			stylistic: { unicorn: false },
			typescript: true,
		},
		slug: 'stylistic-no-unicorn',
	},
	{
		description: 'stylistic with perfectionist disabled',
		options: {
			astro: false,
			react: false,
			stylistic: { perfectionist: false },
			typescript: true,
		},
		slug: 'stylistic-no-perfectionist',
	},
	{
		description: 'stylistic fully disabled on a typescript project',
		options: {
			astro: false,
			react: false,
			stylistic: false,
			typescript: true,
		},
		slug: 'stylistic-off',
	},
	{
		description: 'stylistic with space indentation and double quotes',
		options: {
			astro: false,
			react: false,
			stylistic: { indent: 'space', indentSize: 2, quotes: 'double', semicolons: false },
			typescript: true,
		},
		slug: 'stylistic-custom-style',
	},
	{
		description: 'json and markdown disabled',
		options: {
			astro: false,
			json: false,
			markdown: false,
			react: false,
			typescript: true,
		},
		slug: 'no-json-markdown',
	},
	{
		description: 'imports and node rules disabled',
		options: {
			astro: false,
			imports: false,
			node: false,
			react: false,
			typescript: true,
		},
		slug: 'no-imports-node',
	},
	{
		description: 'commonjs module environment',
		options: {
			astro: false,
			module: { commonjs: true, node: false },
			react: false,
			typescript: false,
		},
		slug: 'module-commonjs',
	},
	{
		description: 'custom ignore globs',
		options: {
			astro: false,
			ignore: { files: ['.gitignore'], globs: ['fixtures/**', '*.generated.ts'] },
			react: false,
			typescript: true,
		},
		slug: 'custom-ignores',
	},
	{
		description: 'extra consumer config appended to the pipeline',
		extraConfigs: [{ name: 'consumer/custom-override', rules: { 'no-console': 'error' } }],
		options: {
			astro: false,
			react: false,
			typescript: true,
		},
		slug: 'consumer-append',
	},
];

export type { MatrixCell };
export { MATRIX };
