import type { ESLint } from 'eslint';
import { isPackageExists } from 'local-pkg';
import { renamePlugins } from '../../const';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import type { NodeOptions } from '../node';
import { TYPESCRIPT_GLOBS, type TypescriptOptions } from '../typescript';
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

	const importsPrefix = renamePlugins['import-x'];
	const unusedImportsPrefix = renamePlugins['unused-imports'];
	const importSortPrefix = renamePlugins['simple-import-sort'];
	const useImports = warnings || !node || amd || commonjs || !webpack || stylistic;

	const plugins: Record<string, ESLint.Plugin> = {};
	const settings: Record<string, unknown> = {};

	if (useImports) {
		plugins[importsPrefix] = await interopDefault(import('eslint-plugin-import-x'));
		settings[`${importsPrefix}/resolver`] = {
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
				[`${importsPrefix}/export`]: 'error',
				[`${importsPrefix}/no-deprecated`]: 'warn',
				[`${importsPrefix}/no-empty-named-blocks`]: 'error',
				[`${importsPrefix}/no-mutable-exports`]: 'error',
				[`${importsPrefix}/no-named-as-default`]: 'warn',
				[`${importsPrefix}/no-named-as-default-member`]: 'warn',
			},
			// Module system rules https://github.com/un-ts/eslint-plugin-import-x?tab=readme-ov-file#module-systems
			...!amd && {
				[`${importsPrefix}/no-amd`]: 'error',
			},
			...!commonjs && {
				[`${importsPrefix}/no-commonjs`]: 'error',
			},
			...!node && {
				[`${importsPrefix}/no-nodejs-modules`]: 'error',
			},
			...{
				[`${importsPrefix}/no-import-module-exports`]: 'error',
			},
			// Static analysis rules https://github.com/un-ts/eslint-plugin-import-x?tab=readme-ov-file#static-analysis
			...{
				[`${importsPrefix}/default`]: 'error',
				[`${importsPrefix}/named`]: 'error',
				[`${importsPrefix}/namespace`]: 'error',
				[`${importsPrefix}/no-absolute-path`]: 'error',
				[`${importsPrefix}/no-cycle`]: 'error',
				[`${importsPrefix}/no-relative-packages`]: 'error',
				[`${importsPrefix}/no-relative-parent-imports`]: 'error',
				[`${importsPrefix}/no-restricted-paths`]: 'off',
				[`${importsPrefix}/no-self-import`]: 'error',
				[`${importsPrefix}/no-unresolved`]: ['error', { commonjs: commonjs !== false, amd: amd !== false }],
				[`${importsPrefix}/no-useless-path-segments`]: ['error', {
					noUselessIndex: true,
					commonjs: commonjs !== false,
				}],
			},
			...!webpack && {
				[`${importsPrefix}/no-webpack-loader-syntax`]: 'error',
			},
			...commonjs && {
				[`${importsPrefix}/no-dynamic-require`]: 'error',
			},
			// Style guide
			...stylistic && {
				[`${importsPrefix}/consistent-type-specifier-style`]: [
					'error',
					'prefer-top-level',
				],
				[`${importsPrefix}/exports-last`]: 'error',
				[`${importsPrefix}/extensions`]: ['error', 'never', {
					'css': 'always',
					'jpeg': 'always',
					'jpg': 'always',
					'json': 'always',
					'png': 'always',
					'svg': 'always',
					'webp': 'always',
				}],
				[`${importsPrefix}/first`]: 'error',
				[`${importsPrefix}/group-exports`]: 'error',
				[`${importsPrefix}/newline-after-import`]: [
					'error',
					{ count: 1 },
				],
				[`${importsPrefix}/no-anonymous-default-export`]: 'error',
				[`${importsPrefix}/no-duplicates`]: 'error',
				[`${importsPrefix}/no-namespace`]: 'error',
				[`${importsPrefix}/prefer-default-export`]: 'error',
			},
			...webpack && stylistic && {
				[`${importsPrefix}/dynamic-import-chunkname`]: 'error',
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
				[importsPrefix]: await interopDefault(import('eslint-plugin-import-x')),
			},
			rules: {
				[`${importsPrefix}/named`]: 'off',
			},
			settings: {
				[`${importsPrefix}/extensions`]: typeScriptExtensions,
				[`${importsPrefix}/external-module-folders`]: ['node_modules', 'node_modules/@types'],
				[`${importsPrefix}/parsers`]: {
					'@typescript-eslint/parser': [...typeScriptExtensions, '.cts', '.mts'],
				},
				[`${importsPrefix}/resolver`]: {
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
