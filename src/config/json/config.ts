import type { OptionsOverrides, StylisticConfig } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import { StylisticConfigDefaults } from '../stylistic';
import GLOB_JSON from './globs';

export default async function json(
	options: OptionsOverrides | boolean = true,
	stylistic: (OptionsOverrides & StylisticConfig) | false,
): Promise<TypedFlatConfigItem[]> {
	if (!options) {
		return [];
	}
	const {
		overrides = {},
	} = typeof options === 'boolean' ? {} : options;

	const {
		indent,
	} = {
		...StylisticConfigDefaults,
		...stylistic,
	};

	const [
		pluginJsonc,
		parserJsonc,
	] = await Promise.all([
		interopDefault(import('eslint-plugin-jsonc')),
		interopDefault(import('jsonc-eslint-parser')),
	] as const);

	const configs: TypedFlatConfigItem[] = [
		{
			name: 'hexatool/json/setup',
			plugins: {
				json: pluginJsonc,
			},
		},
		{
			files: GLOB_JSON,
			languageOptions: {
				parser: parserJsonc,
			},
			name: 'hexatool/json/parser',
		},
		{
			files: GLOB_JSON,
			name: 'hexatool/json/rules',
			rules: {
				'json/no-bigint-literals': 'error',
				'json/no-binary-expression': 'error',
				'json/no-binary-numeric-literals': 'error',
				'json/no-dupe-keys': 'error',
				'json/no-escape-sequence-in-identifier': 'error',
				'json/no-floating-decimal': 'error',
				'json/no-hexadecimal-numeric-literals': 'error',
				'json/no-infinity': 'error',
				'json/no-multi-str': 'error',
				'json/no-nan': 'error',
				'json/no-number-props': 'error',
				'json/no-numeric-separators': 'error',
				'json/no-octal': 'error',
				'json/no-octal-escape': 'error',
				'json/no-octal-numeric-literals': 'error',
				'json/no-parenthesized': 'error',
				'json/no-plus-sign': 'error',
				'json/no-regexp-literals': 'error',
				'json/no-sparse-arrays': 'error',
				'json/no-template-literals': 'error',
				'json/no-undefined-value': 'error',
				'json/no-unicode-codepoint-escapes': 'error',
				'json/no-useless-escape': 'error',
				'json/space-unary-ops': 'error',
				'json/valid-json-number': 'error',
				'json/vue-custom-block/no-parsing-error': 'error',
				...overrides,
			},
		},
	];

	if (stylistic) {
		configs.push({
			files: GLOB_JSON,
			name: 'hexatool/json/rules/style',
			rules: {
				'json/array-bracket-spacing': [
					'error',
					'never',
				],
				'json/comma-dangle': [
					'error',
					'never',
				],
				'json/comma-style': [
					'error',
					'last',
				],
				'json/indent': [
					'error',
					indent,
				],
				'json/key-spacing': [
					'error',
					{ afterColon: true, beforeColon: false },
				],
				'json/object-curly-newline': [
					'error',
					{ consistent: true, multiline: true },
				],
				'json/object-curly-spacing': [
					'error',
					'always',
				],
				'json/object-property-newline': [
					'error',
					{ allowMultiplePropertiesPerLine: true },
				],
				'json/quote-props': 'error',
				'json/quotes': 'error',
			},
		});
		configs.push({
			files: ['**/package.json'],
			name: 'hexatool/json/rules/style/package.json',
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
						order: [
							'types',
							'import',
							'require',
							'default',
						],
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
		});
		configs.push({
			files: [
				'**/tsconfig.json',
				'**/tsconfig.*.json',
			],
			name: 'hexatool/json/rules/style/tsconfig.json',
			rules: {
				'jsonc/sort-keys': [
					'error',
					{
						order: [
							'extends',
							'compilerOptions',
							'references',
							'files',
							'include',
							'exclude',
						],
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
		});
	}

	return configs;
}
