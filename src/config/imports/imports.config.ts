import { isPackageExists } from 'local-pkg';

import { PLUGIN_RENAME } from '../../const';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import type { CoreOptions } from '../core';
import type { TypescriptOptions } from '../typescript';
import { TYPESCRIPT_GLOBS } from '../typescript';
import type { ImportsOptions } from './imports.options';

const IMPORT_CONFIG_NAME = 'hexatool/imports';

export default async function imports(
	options: ImportsOptions = true,
	core: CoreOptions = {},
	typescript: TypescriptOptions = isPackageExists('typescript')
): Promise<TypedFlatConfigItem[]> {
	if (options === false) {
		return [];
	}
	const { stylistic = true } = typeof options === 'boolean' ? {} : options;
	const { amd = false, commonjs = false, node = true, webpack = false } = core;

	const importXPlugin = 'import-x';
	const importXPluginRename = PLUGIN_RENAME[importXPlugin];
	const unusedImportsPrefix = PLUGIN_RENAME['unused-imports'];
	const importSortPrefix = PLUGIN_RENAME['simple-import-sort'];

	const configs: TypedFlatConfigItem[] = [];

	configs.push({
		name: `${IMPORT_CONFIG_NAME}/setup`,
		plugins: {
			[importXPluginRename]: await interopDefault(import('eslint-plugin-import-x')),
		},
		settings: {
			[`${importXPlugin}/resolver`]: {
				node: true,
			},
		},
	});

	if (stylistic) {
		configs.push({
			name: `${IMPORT_CONFIG_NAME}/setup/stylistic`,
			plugins: {
				[importSortPrefix]: await interopDefault(import('eslint-plugin-simple-import-sort')),
				[unusedImportsPrefix]: await interopDefault(import('eslint-plugin-unused-imports')),
			},
		});
	}

	if (typescript) {
		const typeScriptExtensions = ['.ts', '.tsx'] as const;
		const allExtensions = [...typeScriptExtensions, '.js', '.jsx'] as const;

		configs.push({
			files: [...TYPESCRIPT_GLOBS],
			name: `${IMPORT_CONFIG_NAME}/setup/typescript`,
			plugins: {
				[importXPluginRename]: await interopDefault(import('eslint-plugin-import-x')),
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

	configs.push({
		name: `${IMPORT_CONFIG_NAME}/rules`,
		rules: {
			// Warnings rules https://github.com/un-ts/eslint-plugin-import-x?tab=readme-ov-file#helpful-warnings
			...{
				[`${importXPluginRename}/export`]: 'error',
				[`${importXPluginRename}/no-deprecated`]: 'warn',
				[`${importXPluginRename}/no-empty-named-blocks`]: 'error',
				[`${importXPluginRename}/no-mutable-exports`]: 'error',
				[`${importXPluginRename}/no-named-as-default`]: 'warn',
				[`${importXPluginRename}/no-named-as-default-member`]: 'warn',
			},
			// Module system rules
			...(!amd && {
				[`${importXPluginRename}/no-amd`]: 'error',
			}),
			...(!commonjs && {
				[`${importXPluginRename}/no-commonjs`]: 'error',
			}),
			...(!node && {
				[`${importXPluginRename}/no-nodejs-modules`]: 'error',
			}),
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
				[`${importXPluginRename}/no-unresolved`]: ['error', { amd, commonjs }],
				[`${importXPluginRename}/no-useless-path-segments`]: [
					'error',
					{
						commonjs,
						noUselessIndex: true,
					},
				],
			},
			...(!webpack && {
				[`${importXPluginRename}/no-webpack-loader-syntax`]: 'error',
			}),
			...(commonjs && {
				[`${importXPluginRename}/no-dynamic-require`]: 'error',
			}),
		},
	});

	if (stylistic) {
		configs.push({
			name: `${IMPORT_CONFIG_NAME}/rules/stylistic`,
			rules: {
				...{
					[`${importXPluginRename}/consistent-type-specifier-style`]: ['error', 'prefer-top-level'],
					[`${importXPluginRename}/exports-last`]: 'error',
					[`${importXPluginRename}/first`]: 'error',
					[`${importXPluginRename}/group-exports`]: 'error',
					[`${importXPluginRename}/newline-after-import`]: ['error', { count: 1 }],
					[`${importXPluginRename}/no-anonymous-default-export`]: 'error',
					[`${importXPluginRename}/no-duplicates`]: 'error',
					[`${importXPluginRename}/no-namespace`]: 'error',
					[`${importXPluginRename}/prefer-default-export`]: 'error',
				},
				...(webpack && {
					[`${importXPluginRename}/dynamic-import-chunkname`]: 'error',
				}),
				// Sorting rules
				...{
					[`${importSortPrefix}/exports`]: 'error',
					[`${importSortPrefix}/imports`]: 'error',
					'sort-imports': [
						'error',
						{
							allowSeparatedGroups: false,
							ignoreCase: false,
							ignoreDeclarationSort: true,
							ignoreMemberSort: false,
							memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
						},
					],
				},
				// Unused imports rules
				...{
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
			},
		});
	}

	if (typescript) {
		configs.push({
			files: [...TYPESCRIPT_GLOBS],
			name: `${IMPORT_CONFIG_NAME}/rules/typescript`,
			rules: {
				[`${importXPluginRename}/named`]: 'off',
			},
		});
	}

	return configs;
}
