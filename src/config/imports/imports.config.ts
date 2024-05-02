import type { ESLint } from 'eslint';
import { isPackageExists } from 'local-pkg';

import { renamePlugins } from '../../const';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import type { NodeOptions } from '../node';
import type {TypescriptOptions} from '../typescript';
import { TYPESCRIPT_GLOBS  } from '../typescript';
import type { ImportsOptions } from './imports.options';


const IMPORT_CONFIG_NAME = 'hexatool/imports';

export default async function imports(
	options: ImportsOptions = true,
	node: NodeOptions = true,
	typescript: TypescriptOptions = isPackageExists('typescript'),
): Promise<TypedFlatConfigItem[]> {
	if (options === false) {
		return [];
	}
	const {
		amd = false,
		commonjs = false,
		sort = true,
		removeUnused = true,
		overrides = undefined,
		warnings = true,
		webpack = false,
		stylistic = true,
	} = typeof options === 'boolean' ? {} : options;

	const importXPlugin = 'import-x';
	const importXPluginRename = renamePlugins[importXPlugin];
	const unusedImportsPrefix = renamePlugins['unused-imports'];
	const importSortPrefix = renamePlugins['simple-import-sort'];
	const useImports = warnings || !node || amd || commonjs || !webpack || stylistic;

	const plugins: Record<string, ESLint.Plugin> = {};
	const settings: Record<string, unknown> = {};

	if (useImports) {
		plugins[importXPluginRename] = await interopDefault(import('eslint-plugin-import-x'));
		settings[`${importXPlugin}/resolver`] = {
			node: true,
		};
	}
	if (removeUnused) {
		plugins[unusedImportsPrefix] = await interopDefault(import('eslint-plugin-unused-imports'));
	}

	if (sort) {
		plugins[importSortPrefix] = await interopDefault(import('eslint-plugin-simple-import-sort'));
	}

	const configs: TypedFlatConfigItem[] = [];
	const config: TypedFlatConfigItem = {
		name: `${IMPORT_CONFIG_NAME}/rules`,
		plugins,
		rules: {
			// Warnings rules https://github.com/un-ts/eslint-plugin-import-x?tab=readme-ov-file#helpful-warnings
			...warnings && {
				[`${importXPluginRename}/export`]: 'error',
				[`${importXPluginRename}/no-deprecated`]: 'warn',
				[`${importXPluginRename}/no-empty-named-blocks`]: 'error',
				[`${importXPluginRename}/no-mutable-exports`]: 'error',
				[`${importXPluginRename}/no-named-as-default`]: 'warn',
				[`${importXPluginRename}/no-named-as-default-member`]: 'warn',
			},
			// Module system rules https://github.com/un-ts/eslint-plugin-import-x?tab=readme-ov-file#module-systems
			...!amd && {
				[`${importXPluginRename}/no-amd`]: 'error',
			},
			...!commonjs && {
				[`${importXPluginRename}/no-commonjs`]: 'error',
			},
			...!node && {
				[`${importXPluginRename}/no-nodejs-modules`]: 'error',
			},
			...{
				[`${importXPluginRename}/no-import-module-exports`]: 'error',
			},
			// Static analysis rules https://github.com/un-ts/eslint-plugin-import-x?tab=readme-ov-file#static-analysis
			...{
				[`${importXPluginRename}/default`]: 'error',
				[`${importXPluginRename}/named`]: 'error',
				[`${importXPluginRename}/namespace`]: 'error',
				[`${importXPluginRename}/no-absolute-path`]: 'error',
				[`${importXPluginRename}/no-cycle`]: 'error',
				[`${importXPluginRename}/no-relative-packages`]: 'error',
				[`${importXPluginRename}/no-restricted-paths`]: 'off',
				[`${importXPluginRename}/no-self-import`]: 'error',
				[`${importXPluginRename}/no-unresolved`]: ['error', { commonjs: commonjs !== false, amd: amd !== false }],
				[`${importXPluginRename}/no-useless-path-segments`]: ['error', {
					noUselessIndex: true,
					commonjs: commonjs !== false,
				}],
			},
			...!webpack && {
				[`${importXPluginRename}/no-webpack-loader-syntax`]: 'error',
			},
			...commonjs && {
				[`${importXPluginRename}/no-dynamic-require`]: 'error',
			},
			// Style guide
			...stylistic && {
				[`${importXPluginRename}/consistent-type-specifier-style`]: [
					'error',
					'prefer-top-level',
				],
				[`${importXPluginRename}/exports-last`]: 'error',
				[`${importXPluginRename}/first`]: 'error',
				[`${importXPluginRename}/group-exports`]: 'error',
				[`${importXPluginRename}/newline-after-import`]: [
					'error',
					{ count: 1 },
				],
				[`${importXPluginRename}/no-anonymous-default-export`]: 'error',
				[`${importXPluginRename}/no-duplicates`]: 'error',
				[`${importXPluginRename}/no-namespace`]: 'error',
				[`${importXPluginRename}/prefer-default-export`]: 'error',
			},
			...webpack && stylistic && {
				[`${importXPluginRename}/dynamic-import-chunkname`]: 'error',
			},
			// Sorting rules
			...sort && {
				'sort-imports': [
					'error',
					{
						allowSeparatedGroups: false,
						ignoreCase: false,
						ignoreDeclarationSort: true,
						ignoreMemberSort: false,
						memberSyntaxSortOrder: [
							'none',
							'all',
							'multiple',
							'single',
						],
					},
				],
				[`${importSortPrefix}/exports`]: 'error',
				[`${importSortPrefix}/imports`]: 'error',
			},
			// Unused imports rules
			...removeUnused && {
				[`${unusedImportsPrefix}/no-unused-imports`]: 'error',
				[`${unusedImportsPrefix}/no-unused-vars`]: [
					'warn',
					{
						args: 'after-used',
						argsIgnorePattern: '^_',
						ignoreRestSiblings: true,
						vars: 'all',
						varsIgnorePattern: '^_',
					},
				],
			},
			...overrides,
		},
	};

	if (Object.keys(settings).length > 0) {
		config.settings = settings;
	}

	configs.push(config);

	if (typescript && useImports) {
		const typeScriptExtensions = ['.ts', '.tsx'] as const;
		const allExtensions = [...typeScriptExtensions, '.js', '.jsx'] as const;

		configs.push({
			name: `${IMPORT_CONFIG_NAME}/rules/typescript`,
			files: [...TYPESCRIPT_GLOBS],
			plugins: {
				[importXPluginRename]: await interopDefault(import('eslint-plugin-import-x')),
			},
			rules: {
				[`${importXPluginRename}/named`]: 'off',
			},
			settings: {
				[`${importXPlugin}/extensions`]: typeScriptExtensions,
				[`${importXPlugin}/external-module-folders`]: ['node_modules', 'node_modules/@types'],
				[`${importXPlugin}/parsers`]: {
					'@typescript-eslint/parser': [...typeScriptExtensions, '.cts', '.mts'],
				},
				[`${importXPlugin}/resolver`]: {
					node: {
						extensions: allExtensions,
					},
					typescript: true,
				},
			},
		});

	}

	return configs;
}
