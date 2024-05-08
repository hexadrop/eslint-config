import type { ESLint, Linter } from 'eslint';

import { PLUGIN_RENAME, PLUGIN_RENAME_TYPESCRIPT } from '../../const';
import type { HexatoolEslintOptions } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault, pluginConfigRules } from '../../utils';
import renameRules from '../../utils/rename-rules';
import { JAVASCRIPT_GLOBS, SOURCE_GLOBS } from '../core';
import { GLOB_JSON, GLOB_JSON_PACKAGE, GLOB_JSON_TSCONFIG } from '../json';
import { GLOB_MARKDOWN, GLOB_MARKDOWN_JSON, GLOB_MARKDOWN_SOURCE, GLOB_MARKDOWN_SOURCE_WITH_JSON } from '../markdown';
import { DTS_GLOBS, TYPESCRIPT_GLOBS } from '../typescript';
import {
	STYLISTIC_CONFIG_NAME_RULES,
	STYLISTIC_CONFIG_NAME_RULES_IMPORTS,
	STYLISTIC_CONFIG_NAME_RULES_JSON,
	STYLISTIC_CONFIG_NAME_RULES_JSON_PACKAGE,
	STYLISTIC_CONFIG_NAME_RULES_JSON_TSCONFIG,
	STYLISTIC_CONFIG_NAME_RULES_MARKDOWN,
	STYLISTIC_CONFIG_NAME_RULES_MARKDOWN_SOURCE,
	STYLISTIC_CONFIG_NAME_RULES_PERFECTIONIST,
	STYLISTIC_CONFIG_NAME_RULES_PRETTIER,
	STYLISTIC_CONFIG_NAME_RULES_PRETTIER_JSON,
	STYLISTIC_CONFIG_NAME_RULES_PRETTIER_MARKDOWN_SOURCE,
	STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT,
	STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT_DTS,
	STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT_TYPE_AWARE,
	STYLISTIC_CONFIG_NAME_RULES_UNICORN,
	STYLISTIC_CONFIG_NAME_RULES_UNICORN_MARKDOWN,
	STYLISTIC_CONFIG_NAME_RULES_UNICORN_MARKDOWN_SOURCE,
	STYLISTIC_CONFIG_NAME_SETUP,
} from './stylistic.config-name';
import prettierOptions from './stylistic.options-prettier';
import stylisticOptions from './stylistic.options-stylistic';

export default async function stylistic(options: HexatoolEslintOptions): Promise<TypedFlatConfigItem[]> {
	const {
		imports,
		json,
		markdown,
		module: { webpack },
		stylistic,
		typescript,
	} = options;
	if (stylistic === false) {
		return [];
	}
	const { format, indent, indentSize, perfectionist, printWidth, unicorn } = stylistic;
	const isTypeAware = typeof typescript !== 'boolean';
	const typescriptPluginRename = PLUGIN_RENAME['@typescript-eslint'];
	const importXPlugin = 'import-x';
	const importXPluginRename = PLUGIN_RENAME[importXPlugin];
	const unusedImportsPrefix = PLUGIN_RENAME['unused-imports'];
	const importSortPrefix = PLUGIN_RENAME['simple-import-sort'];

	const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));
	const pluginStylisticOptions = stylisticOptions(stylistic);
	const pluginStylisticConfig = pluginStylistic.configs.customize(pluginStylisticOptions);
	const pluginStylisticRules = pluginStylisticConfig.rules as Linter.RulesRecord;

	const pluginUnicorn = (await interopDefault(import('eslint-plugin-unicorn'))) as ESLint.Plugin;

	const pluginPerfectionist = await interopDefault(import('eslint-plugin-perfectionist/configs/recommended-natural'));

	const config: TypedFlatConfigItem[] = [
		{
			name: STYLISTIC_CONFIG_NAME_SETUP,
			plugins: {
				style: pluginStylistic as ESLint.Plugin,
				...(unicorn && {
					unicorn: pluginUnicorn,
				}),
				...(perfectionist && {
					perfectionist: pluginPerfectionist.plugins.perfectionist,
				}),
				...(imports && {
					[importSortPrefix]: await interopDefault(import('eslint-plugin-simple-import-sort')),
					[unusedImportsPrefix]: await interopDefault(import('eslint-plugin-unused-imports')),
				}),
				...(format && {
					format: await interopDefault(import('eslint-plugin-format')),
				}),
			},
		},
		{
			name: STYLISTIC_CONFIG_NAME_RULES,
			rules: {
				...renameRules(pluginStylisticRules, PLUGIN_RENAME),
				curly: ['error', 'all'],
				'style/implicit-arrow-linebreak': ['error', 'beside'],
				'style/jsx-sort-props': 'error',
				'style/max-len': ['error', { code: printWidth, ignoreComments: true, ignoreUrls: true }],
				'style/no-extra-semi': 'error',
				'style/padding-line-between-statements': ['error', { blankLine: 'always', next: 'return', prev: '*' }],
				...(format && {
					'style/operator-linebreak': 'off',
				}),
			},
		},
	];

	if (markdown) {
		config.push(
			{
				files: GLOB_MARKDOWN,
				name: STYLISTIC_CONFIG_NAME_RULES_MARKDOWN,
				rules: {
					'style/max-len': 'off',
				},
			},
			{
				files: json ? GLOB_MARKDOWN_SOURCE_WITH_JSON : GLOB_MARKDOWN_SOURCE,
				name: STYLISTIC_CONFIG_NAME_RULES_MARKDOWN_SOURCE,
				rules: {
					'style/indent': ['error', 2],
				},
			}
		);
	}

	if (imports) {
		config.push({
			name: STYLISTIC_CONFIG_NAME_RULES_IMPORTS,
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
						ignoreMemberSort: false,
						memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
					},
				],
			},
		});
	}

	if (typescript) {
		const plugin = await interopDefault(import('@typescript-eslint/eslint-plugin'));
		config.push({
			files: SOURCE_GLOBS,
			name: STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT,
			rules: {
				...pluginConfigRules(plugin, 'stylistic', PLUGIN_RENAME_TYPESCRIPT),
				[`${typescriptPluginRename}/member-ordering`]: [
					'error',
					{
						default: {
							memberTypes: [
								// Index signature
								'signature',
								'call-signature',

								// Fields
								'public-static-field',
								'protected-static-field',
								'private-static-field',
								'#private-static-field',

								'public-decorated-field',
								'protected-decorated-field',
								'private-decorated-field',

								'public-instance-field',
								'protected-instance-field',
								'private-instance-field',
								'#private-instance-field',

								'public-abstract-field',
								'protected-abstract-field',

								'public-field',
								'protected-field',
								'private-field',
								'#private-field',

								'static-field',
								'instance-field',
								'abstract-field',

								'decorated-field',

								'field',

								// Static initialization
								'static-initialization',

								// Constructors
								'public-constructor',
								'protected-constructor',
								'private-constructor',

								'constructor',

								// Getters
								'public-static-get',
								'protected-static-get',
								'private-static-get',
								'#private-static-get',

								'public-decorated-get',
								'protected-decorated-get',
								'private-decorated-get',

								'public-instance-get',
								'protected-instance-get',
								'private-instance-get',
								'#private-instance-get',

								'public-abstract-get',
								'protected-abstract-get',

								'public-get',
								'protected-get',
								'private-get',
								'#private-get',

								'static-get',
								'instance-get',
								'abstract-get',

								'decorated-get',

								'get',

								// Setters
								'public-static-set',
								'protected-static-set',
								'private-static-set',
								'#private-static-set',

								'public-decorated-set',
								'protected-decorated-set',
								'private-decorated-set',

								'public-instance-set',
								'protected-instance-set',
								'private-instance-set',
								'#private-instance-set',

								'public-abstract-set',
								'protected-abstract-set',

								'public-set',
								'protected-set',
								'private-set',
								'#private-set',

								'static-set',
								'instance-set',
								'abstract-set',

								'decorated-set',

								'set',

								// Methods
								'public-static-method',
								'protected-static-method',
								'private-static-method',
								'#private-static-method',

								'public-decorated-method',
								'protected-decorated-method',
								'private-decorated-method',

								'public-instance-method',
								'protected-instance-method',
								'private-instance-method',
								'#private-instance-method',

								'public-abstract-method',
								'protected-abstract-method',

								'public-method',
								'protected-method',
								'private-method',
								'#private-method',

								'static-method',
								'instance-method',
								'abstract-method',

								'decorated-method',

								'method',
							],
							order: 'alphabetically-case-insensitive',
						},
					},
				],
			},
		});

		if (isTypeAware) {
			config.push({
				files: TYPESCRIPT_GLOBS,
				name: STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT_TYPE_AWARE,
				rules: {
					...pluginConfigRules(plugin, 'stylistic-type-checked-only', PLUGIN_RENAME_TYPESCRIPT),
				},
			});
		}

		config.push({
			files: DTS_GLOBS,
			name: STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT_DTS,
			rules: {
				'style/spaced-comment': 'off',
			},
		});
	}

	if (json) {
		config.push(
			{
				files: GLOB_JSON,
				name: STYLISTIC_CONFIG_NAME_RULES_JSON,
				rules: {
					'json/array-bracket-spacing': ['error', 'never'],
					'json/comma-dangle': ['error', 'never'],
					'json/comma-style': ['error', 'last'],
					'json/indent': ['error', indent === 'space' ? indentSize : indent],
					'json/key-spacing': ['error', { afterColon: true, beforeColon: false }],
					'json/object-curly-newline': ['error', { consistent: true, multiline: true }],
					'json/object-curly-spacing': ['error', 'always'],
					'json/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
					'json/quote-props': 'error',
					'json/quotes': 'error',
				},
			},
			{
				files: GLOB_JSON_PACKAGE,
				name: STYLISTIC_CONFIG_NAME_RULES_JSON_PACKAGE,
				rules: {
					'jsonc/sort-array-values': [
						'error',
						{
							order: { type: 'asc' },
							pathPattern: '^files$',
						},
					],
					'jsonc/sort-keys': [
						'error',
						{
							order: [
								'name',
								'displayName',
								'version',
								'author',
								'publisher',
								'description',
								'keywords',
								'categories',
								'repository',
								'homepage',
								'bugs',
								'funding',
								'license',
								'private',
								'publishConfig',
								'type',
								'sideEffects',
								'bin',
								'icon',
								'files',
								'main',
								'module',
								'unpkg',
								'jsdelivr',
								'types',
								'exports',
								'typesVersions',
								'scripts',
								'peerDependencies',
								'peerDependenciesMeta',
								'dependencies',
								'optionalDependencies',
								'devDependencies',
								'overrides',
								'resolutions',
								'engines',
								'packageManager',
								'pnpm',
								'activationEvents',
								'contributes',
								'husky',
								'simple-git-hooks',
								'lint-staged',
								'eslintConfig',
							],
							pathPattern: '^$',
						},
						{
							order: { type: 'asc' },
							pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$',
						},
						{
							order: { type: 'asc' },
							pathPattern: '^(?:resolutions|overrides|pnpm.overrides)$',
						},
						{
							order: { type: 'asc' },
							pathPattern: '^(?:scripts)$',
						},
						{
							order: ['types', 'import', 'require', 'default'],
							pathPattern: '^exports.*$',
						},
						{
							order: [
								// Client hooks only
								'pre-commit',
								'prepare-commit-msg',
								'commit-msg',
								'post-commit',
								'pre-rebase',
								'post-rewrite',
								'post-checkout',
								'post-merge',
								'pre-push',
								'pre-auto-gc',
							],
							pathPattern: '^(?:gitHooks|husky|simple-git-hooks)$',
						},
					],
				},
			},
			{
				files: GLOB_JSON_TSCONFIG,
				name: STYLISTIC_CONFIG_NAME_RULES_JSON_TSCONFIG,
				rules: {
					'jsonc/sort-keys': [
						'error',
						{
							order: ['extends', 'compilerOptions', 'references', 'files', 'include', 'exclude'],
							pathPattern: '^$',
						},
						{
							order: [
								/* Projects */
								'incremental',
								'composite',
								'tsBuildInfoFile',
								'disableSourceOfProjectReferenceRedirect',
								'disableSolutionSearching',
								'disableReferencedProjectLoad',
								/* Language and Environment */
								'target',
								'jsx',
								'jsxFactory',
								'jsxFragmentFactory',
								'jsxImportSource',
								'lib',
								'moduleDetection',
								'noLib',
								'reactNamespace',
								'useDefineForClassFields',
								'emitDecoratorMetadata',
								'experimentalDecorators',
								/* Modules */
								'baseUrl',
								'rootDir',
								'rootDirs',
								'customConditions',
								'module',
								'moduleResolution',
								'moduleSuffixes',
								'noResolve',
								'paths',
								'resolveJsonModule',
								'resolvePackageJsonExports',
								'resolvePackageJsonImports',
								'typeRoots',
								'types',
								'allowArbitraryExtensions',
								'allowImportingTsExtensions',
								'allowUmdGlobalAccess',
								/* JavaScript Support */
								'allowJs',
								'checkJs',
								'maxNodeModuleJsDepth',
								/* Type Checking */
								'strict',
								'strictBindCallApply',
								'strictFunctionTypes',
								'strictNullChecks',
								'strictPropertyInitialization',
								'allowUnreachableCode',
								'allowUnusedLabels',
								'alwaysStrict',
								'exactOptionalPropertyTypes',
								'noFallthroughCasesInSwitch',
								'noImplicitAny',
								'noImplicitOverride',
								'noImplicitReturns',
								'noImplicitThis',
								'noPropertyAccessFromIndexSignature',
								'noUncheckedIndexedAccess',
								'noUnusedLocals',
								'noUnusedParameters',
								'useUnknownInCatchVariables',
								/* Emit */
								'declaration',
								'declarationDir',
								'declarationMap',
								'downlevelIteration',
								'emitBOM',
								'emitDeclarationOnly',
								'importHelpers',
								'importsNotUsedAsValues',
								'inlineSourceMap',
								'inlineSources',
								'mapRoot',
								'newLine',
								'noEmit',
								'noEmitHelpers',
								'noEmitOnError',
								'outDir',
								'outFile',
								'preserveConstEnums',
								'preserveValueImports',
								'removeComments',
								'sourceMap',
								'sourceRoot',
								'stripInternal',
								/* Interop Constraints */
								'allowSyntheticDefaultImports',
								'esModuleInterop',
								'forceConsistentCasingInFileNames',
								'isolatedModules',
								'preserveSymlinks',
								'verbatimModuleSyntax',
								/* Completeness */
								'skipDefaultLibCheck',
								'skipLibCheck',
							],
							pathPattern: '^compilerOptions$',
						},
					],
				},
			}
		);
	}

	if (unicorn) {
		const unicornFlatRecommended = pluginUnicorn.configs
			? (pluginUnicorn.configs['flat/recommended'] as Linter.FlatConfig)
			: undefined;
		const unicornRules = unicornFlatRecommended?.rules as Linter.RulesRecord;

		config.push({
			name: STYLISTIC_CONFIG_NAME_RULES_UNICORN,
			rules: {
				...unicornRules,
				'unicorn/consistent-function-scoping': 'off',
				'unicorn/no-array-reduce': 'off',
				'unicorn/no-nested-ternary': 'off',
				'unicorn/no-static-only-class': 'off',
				'unicorn/prevent-abbreviations': [
					'error',
					{
						allowList: {
							ProcessEnv: true,
							Props: true,
						},
					},
				],
			},
		});

		if (markdown) {
			config.push(
				{
					files: GLOB_MARKDOWN,
					name: STYLISTIC_CONFIG_NAME_RULES_UNICORN_MARKDOWN,
					rules: {
						'unicorn/filename-case': 'off',
					},
				},
				{
					files: json ? GLOB_MARKDOWN_SOURCE_WITH_JSON : GLOB_MARKDOWN_SOURCE,
					name: STYLISTIC_CONFIG_NAME_RULES_UNICORN_MARKDOWN_SOURCE,
					rules: {
						'unicorn/filename-case': 'off',
					},
				}
			);
		}
	}

	if (perfectionist) {
		config.push({
			name: STYLISTIC_CONFIG_NAME_RULES_PERFECTIONIST,
			rules: {
				...pluginPerfectionist.rules,
				'perfectionist/sort-classes': 'off',
				'perfectionist/sort-imports': 'off',
				'perfectionist/sort-interfaces': 'off',
				'perfectionist/sort-named-exports': 'off',
			},
		});
	}

	if (format) {
		const prettierConfig = prettierOptions(stylistic);
		config.push({
			files: typescript ? SOURCE_GLOBS : JAVASCRIPT_GLOBS,
			ignores: json ? GLOB_MARKDOWN_SOURCE_WITH_JSON : GLOB_MARKDOWN_SOURCE,
			name: STYLISTIC_CONFIG_NAME_RULES_PRETTIER,
			rules: {
				'format/prettier': ['error', prettierConfig],
			},
		});

		if (markdown) {
			config.push({
				files: json ? GLOB_MARKDOWN_SOURCE_WITH_JSON : GLOB_MARKDOWN_SOURCE,
				name: STYLISTIC_CONFIG_NAME_RULES_PRETTIER_MARKDOWN_SOURCE,
				rules: {
					'format/prettier': ['error', { ...prettierConfig, tabWidth: 2, useTabs: false }],
				},
			});
		}

		if (json) {
			config.push({
				files: GLOB_MARKDOWN_JSON,
				name: STYLISTIC_CONFIG_NAME_RULES_PRETTIER_JSON,
				rules: {
					'json/indent': ['error', 2],
				},
			});
		}
	}

	return config;
}
