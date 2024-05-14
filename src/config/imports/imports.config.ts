import { PLUGIN_RENAME } from '../../const';
import type { HexatoolEslintOptions } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import { ESLINT_CONFIG_GLOBS } from '../core';
import { GLOB_MARKDOWN_ASTRO, GLOB_MARKDOWN_JSON, GLOB_MARKDOWN_SOURCE } from '../markdown';
import { TYPESCRIPT_GLOBS } from '../typescript';
import {
	IMPORTS_CONFIG_NAME_RULES_STATIC,
	IMPORTS_CONFIG_NAME_RULES_STATIC_MARKDOWN_SOURCE,
	IMPORTS_CONFIG_NAME_RULES_STYLISTIC,
	IMPORTS_CONFIG_NAME_RULES_STYLISTIC_MARKDOWN_SOURCE,
	IMPORTS_CONFIG_NAME_RULES_TYPESCRIPT,
	IMPORTS_CONFIG_NAME_RULES_WARNINGS,
	IMPORTS_CONFIG_NAME_RULES_WARNINGS_ESLINT_CONFIG,
	IMPORTS_CONFIG_NAME_SETUP,
	IMPORTS_CONFIG_NAME_SETUP_TYPESCRIPT,
} from './imports.config-name';

export default async function imports(options: HexatoolEslintOptions): Promise<TypedFlatConfigItem[]> {
	const {
		astro,
		imports,
		json,
		markdown,
		module: { amd, commonjs, ignore: ignoreModules, node: useNodeModules, webpack },
		stylistic,
		typescript,
	} = options;
	if (!imports) {
		return [];
	}
	const importXPlugin = 'import-x';
	const importXPluginRename = PLUGIN_RENAME[importXPlugin];
	const unusedImportsPrefix = PLUGIN_RENAME['unused-imports'];
	const importSortPrefix = PLUGIN_RENAME['simple-import-sort'];

	const configs: TypedFlatConfigItem[] = [];

	configs.push({
		name: IMPORTS_CONFIG_NAME_SETUP,
		plugins: {
			[importXPluginRename]: await interopDefault(import('eslint-plugin-import-x')),
			...(stylistic && {
				[importSortPrefix]: await interopDefault(import('eslint-plugin-simple-import-sort')),
				[unusedImportsPrefix]: await interopDefault(import('eslint-plugin-unused-imports')),
			}),
		},
		settings: {
			[`${importXPlugin}/resolver`]: {
				node: true,
			},
		},
	});

	if (typescript) {
		const typeScriptExtensions = ['.ts', '.tsx'] as const;
		const allExtensions = [...typeScriptExtensions, '.js', '.jsx'] as const;
		configs.push({
			files: TYPESCRIPT_GLOBS,
			name: IMPORTS_CONFIG_NAME_SETUP_TYPESCRIPT,
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

	configs.push(
		{
			name: IMPORTS_CONFIG_NAME_RULES_WARNINGS,
			rules: {
				// Warnings rules https://github.com/un-ts/eslint-plugin-import-x?tab=readme-ov-file#helpful-warnings
				[`${importXPluginRename}/export`]: 'error',
				[`${importXPluginRename}/no-deprecated`]: 'warn',
				[`${importXPluginRename}/no-empty-named-blocks`]: 'error',
				[`${importXPluginRename}/no-mutable-exports`]: 'error',
				[`${importXPluginRename}/no-named-as-default`]: 'warn',
				[`${importXPluginRename}/no-named-as-default-member`]: 'warn',
				// Module system rules
				...(!amd && {
					[`${importXPluginRename}/no-amd`]: 'error',
				}),
				...(!commonjs && {
					[`${importXPluginRename}/no-commonjs`]: 'error',
				}),
				...(!useNodeModules && {
					[`${importXPluginRename}/no-nodejs-modules`]: 'error',
				}),

				[`${importXPluginRename}/default`]: 'error',
			},
		},
		{
			name: IMPORTS_CONFIG_NAME_RULES_STATIC,
			rules: {
				// Static analysis rules https://github.com/un-ts/eslint-plugin-import-x?tab=readme-ov-file#static-analysis
				[`${importXPluginRename}/named`]: 'error',
				[`${importXPluginRename}/no-absolute-path`]: 'error',
				[`${importXPluginRename}/no-cycle`]: 'error',
				[`${importXPluginRename}/no-import-module-exports`]: 'error',
				[`${importXPluginRename}/no-relative-packages`]: 'error',
				[`${importXPluginRename}/no-restricted-paths`]: 'off',
				[`${importXPluginRename}/no-self-import`]: 'error',
				[`${importXPluginRename}/no-unresolved`]: ['error', { amd, commonjs, ignore: ignoreModules }],
				[`${importXPluginRename}/no-useless-path-segments`]: [
					'error',
					{
						commonjs,
						noUselessIndex: true,
					},
				],
				...(!webpack && {
					[`${importXPluginRename}/no-webpack-loader-syntax`]: 'error',
				}),
				...(commonjs && {
					[`${importXPluginRename}/no-dynamic-require`]: 'error',
				}),
			},
		},
		{
			files: ESLINT_CONFIG_GLOBS,
			name: IMPORTS_CONFIG_NAME_RULES_WARNINGS_ESLINT_CONFIG,
			rules: {
				[`${importXPluginRename}/default`]: 'off',
				[`${importXPluginRename}/no-deprecated`]: 'off',
				[`${importXPluginRename}/no-named-as-default`]: 'off',
				[`${importXPluginRename}/no-named-as-default-member`]: 'off',
			},
		}
	);

	if (markdown) {
		configs.push({
			files: [
				...GLOB_MARKDOWN_SOURCE,
				...(json ? GLOB_MARKDOWN_JSON : []),
				...(astro ? GLOB_MARKDOWN_ASTRO : []),
			],
			name: IMPORTS_CONFIG_NAME_RULES_STATIC_MARKDOWN_SOURCE,
			rules: {
				[`${importXPluginRename}/no-unresolved`]: 'off',
			},
		});
	}

	if (typescript) {
		configs.push({
			files: TYPESCRIPT_GLOBS,
			name: IMPORTS_CONFIG_NAME_RULES_TYPESCRIPT,
			rules: {
				[`${importXPluginRename}/named`]: 'off',
			},
		});
	}

	if (stylistic) {
		configs.push({
			name: IMPORTS_CONFIG_NAME_RULES_STYLISTIC,
			rules: {
				[`${importXPluginRename}/consistent-type-specifier-style`]: ['error', 'prefer-top-level'],
				[`${importXPluginRename}/exports-last`]: 'error',
				[`${importXPluginRename}/first`]: 'error',
				[`${importXPluginRename}/group-exports`]: 'error',
				[`${importXPluginRename}/newline-after-import`]: ['error', { count: 1 }],
				[`${importXPluginRename}/no-anonymous-default-export`]: 'error',
				[`${importXPluginRename}/no-duplicates`]: 'error',
				[`${importXPluginRename}/no-namespace`]: 'error',
				[`${importXPluginRename}/prefer-default-export`]: 'error',
				...(webpack && {
					[`${importXPluginRename}/dynamic-import-chunkname`]: 'error',
				}),

				// Sorting rules
				[`${importSortPrefix}/exports`]: 'error',
				[`${importSortPrefix}/imports`]: 'error',

				// Unused imports rules
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
				'sort-imports': [
					'error',
					{
						allowSeparatedGroups: false,
						ignoreCase: false,
						ignoreDeclarationSort: true,
						ignoreMemberSort: true,
						memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
					},
				],
			},
		});

		if (markdown) {
			configs.push({
				files: GLOB_MARKDOWN_SOURCE,
				name: IMPORTS_CONFIG_NAME_RULES_STYLISTIC_MARKDOWN_SOURCE,
				rules: {
					[`${unusedImportsPrefix}/no-unused-vars`]: ['off'],
				},
			});
		}
	}

	return configs;
}
