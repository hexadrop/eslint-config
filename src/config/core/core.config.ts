import globals from 'globals';

import { PLUGIN_RENAME } from '../../const';
import type { HexatoolEslintOptions } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import { GLOB_MARKDOWN_SOURCE, GLOB_MARKDOWN_SOURCE_WITH_JSON } from '../markdown';
import {
	CORE_CONFIG_NAME_RULES,
	CORE_CONFIG_NAME_RULES_IMPORTS_STATIC,
	CORE_CONFIG_NAME_RULES_IMPORTS_STATIC_MARKDOWN_SOURCE,
	CORE_CONFIG_NAME_RULES_IMPORTS_WARNINGS,
	CORE_CONFIG_NAME_RULES_MARKDOWN_SOURCE,
	CORE_CONFIG_NAME_RULES_NODE,
	CORE_CONFIG_NAME_SETUP,
} from './core.config-name';

export default async function core(options: HexatoolEslintOptions): Promise<TypedFlatConfigItem[]> {
	const {
		imports,
		json,
		markdown,
		module: { amd, commonjs, ignore: ignoreModules, node: useNodeModules, webpack },
		node,
	} = options;

	const importXPlugin = 'import-x';
	const importXPluginRename = PLUGIN_RENAME[importXPlugin];
	const nodePluginName = PLUGIN_RENAME.n;

	const configs: TypedFlatConfigItem[] = [
		{
			languageOptions: {
				ecmaVersion: 2020,
				globals: {
					...globals.browser,
					...globals.es2021,
					...globals.node,
					document: 'readonly',
					navigator: 'readonly',
					window: 'readonly',
				},
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					ecmaVersion: 'latest',
					sourceType: 'module',
				},
				sourceType: 'module',
			},
			linterOptions: {
				reportUnusedDisableDirectives: true,
			},
			name: CORE_CONFIG_NAME_SETUP,
			plugins: {
				...(imports && {
					[importXPluginRename]: await interopDefault(import('eslint-plugin-import-x')),
				}),
				...(node && {
					[nodePluginName]: await interopDefault(import('eslint-plugin-n')),
				}),
			},
			settings: {
				...(imports && {
					[`${importXPlugin}/resolver`]: {
						node: true,
					},
				}),
			},
		},
		{
			name: CORE_CONFIG_NAME_RULES,
			rules: {
				'accessor-pairs': ['error', { enforceForClassMembers: true, setWithoutGet: true }],
				'array-callback-return': ['error', { checkForEach: true }],
				'block-scoped-var': 'error',
				camelcase: ['error', { properties: 'never' }],
				'consistent-this': ['error', 'self'],
				'constructor-super': 'error',
				'default-case-last': 'error',
				'dot-notation': 'error',
				eqeqeq: 'error',
				'for-direction': 'error',
				'func-name-matching': 'error',
				'func-names': ['error', 'as-needed'],
				'getter-return': 'error',
				'grouped-accessor-pairs': 'error',
				'guard-for-in': 'error',
				'line-comment-position': ['error', { position: 'above' }],
				'max-depth': ['error', 4],
				'max-params': 'off',
				'multiline-comment-style': ['error', 'starred-block'],
				'new-cap': ['error', { capIsNew: false }],
				'no-alert': 'error',
				'no-array-constructor': 'error',
				'no-async-promise-executor': 'error',
				'no-await-in-loop': 'error',
				'no-bitwise': 'error',
				'no-caller': 'error',
				'no-case-declarations': 'error',
				'no-class-assign': 'error',
				'no-compare-neg-zero': 'error',
				'no-cond-assign': ['error', 'always'],
				'no-console': ['error', { allow: ['error'] }],
				'no-const-assign': 'error',
				'no-constant-binary-expression': 'error',
				'no-constant-condition': 'error',
				'no-constructor-return': 'error',
				'no-control-regex': 'error',
				'no-debugger': 'error',
				'no-delete-var': 'error',
				'no-dupe-args': 'error',
				'no-dupe-class-members': 'error',
				'no-dupe-else-if': 'error',
				'no-dupe-keys': 'error',
				'no-duplicate-case': 'error',
				'no-duplicate-imports': 'off',
				'no-else-return': ['error', { allowElseIf: false }],
				'no-empty': 'error',
				'no-empty-character-class': 'error',
				'no-empty-pattern': 'error',
				'no-empty-static-block': 'error',
				'no-eq-null': 'error',
				'no-eval': 'error',
				'no-ex-assign': 'error',
				'no-extend-native': 'error',
				'no-extra-bind': 'error',
				'no-extra-boolean-cast': 'error',
				'no-extra-label': 'error',

				'no-fallthrough': 'error',
				'no-func-assign': 'error',
				'no-global-assign': 'error',
				'no-implicit-coercion': 'error',
				'no-implicit-globals': 'error',
				'no-implied-eval': 'error',
				'no-import-assign': 'error',
				'no-inline-comments': 'error',
				'no-inner-declarations': 'error',
				'no-invalid-regexp': 'error',
				'no-invalid-this': 'error',
				'no-irregular-whitespace': 'error',
				'no-iterator': 'error',
				'no-label-var': 'error',
				'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
				'no-lone-blocks': 'error',
				'no-lonely-if': 'error',
				'no-loop-func': 'error',
				'no-loss-of-precision': 'error',
				'no-misleading-character-class': 'error',
				'no-multi-assign': 'error',
				'no-multi-str': 'error',
				'no-negated-condition': 'error',
				'no-new': 'error',
				'no-new-func': 'error',
				'no-new-native-nonconstructor': 'error',
				'no-new-wrappers': 'error',
				'no-nonoctal-decimal-escape': 'error',
				'no-obj-calls': 'error',
				'no-octal': 'error',
				'no-octal-escape': 'error',
				'no-param-reassign': 'error',
				'no-promise-executor-return': 'error',
				'no-proto': 'error',
				'no-prototype-builtins': 'error',
				'no-redeclare': 'error',
				'no-regex-spaces': 'error',
				'no-restricted-globals': [
					'error',
					{ message: 'Use `globalThis` instead.', name: 'global' },
					{ message: 'Use `globalThis` instead.', name: 'self' },
				],
				'no-restricted-properties': [
					'error',
					{
						message: 'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.',
						property: '__proto__',
					},
					{ message: 'Use `Object.defineProperty` instead.', property: '__defineGetter__' },
					{ message: 'Use `Object.defineProperty` instead.', property: '__defineSetter__' },
					{ message: 'Use `Object.getOwnPropertyDescriptor` instead.', property: '__lookupGetter__' },
					{ message: 'Use `Object.getOwnPropertyDescriptor` instead.', property: '__lookupSetter__' },
				],
				'no-restricted-syntax': [
					'error',
					'DebuggerStatement',
					'LabeledStatement',
					'WithStatement',
					'TSEnumDeclaration[const=true]',
					'TSExportAssignment',
				],
				'no-return-assign': 'error',
				'no-self-assign': 'error',
				'no-self-compare': 'error',
				'no-sequences': 'error',
				'no-setter-return': 'error',
				'no-shadow-restricted-names': 'error',
				'no-sparse-arrays': 'error',
				'no-template-curly-in-string': 'error',
				'no-this-before-super': 'error',
				'no-throw-literal': 'error',
				'no-undef': 'error',
				'no-undef-init': 'error',
				'no-underscore-dangle': 'error',
				'no-unexpected-multiline': 'error',
				'no-unmodified-loop-condition': 'error',
				'no-unneeded-ternary': 'error',
				'no-unreachable': 'error',
				'no-unreachable-loop': 'error',
				'no-unsafe-finally': 'error',
				'no-unsafe-negation': 'error',
				'no-unsafe-optional-chaining': 'error',
				'no-unused-expressions': 'error',
				'no-unused-labels': 'error',
				'no-unused-private-class-members': 'error',
				'no-use-before-define': [
					'error',
					{
						allowNamedExports: false,
						classes: true,
						functions: false,
						variables: true,
					},
				],
				'no-useless-assignment': 'error',
				'no-useless-backreference': 'error',
				'no-useless-call': 'error',
				'no-useless-catch': 'error',
				'no-useless-computed-key': 'error',
				'no-useless-constructor': 'error',
				'no-useless-escape': 'error',
				'no-useless-rename': 'error',
				'no-useless-return': 'error',
				'no-var': 'error',
				'no-with': 'error',
				'object-shorthand': 'error',
				'one-var': 'off',
				'operator-assignment': ['error', 'always'],
				'prefer-arrow-callback': [
					'error',
					{
						allowNamedFunctions: false,
						allowUnboundThis: true,
					},
				],
				'prefer-const': 'error',
				'prefer-exponentiation-operator': 'error',
				'prefer-named-capture-group': 'error',
				'prefer-numeric-literals': 'error',
				'prefer-object-has-own': 'error',
				'prefer-promise-reject-errors': 'error',
				'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
				'prefer-rest-params': 'error',
				'prefer-spread': 'error',
				'prefer-template': 'error',
				radix: 'error',
				'require-atomic-updates': 'error',
				'require-await': 'error',
				'require-yield': 'error',
				'symbol-description': 'error',
				'unicode-bom': ['error', 'never'],
				'use-isnan': ['error', { enforceForIndexOf: true, enforceForSwitchCase: true }],

				'valid-typeof': ['error', { requireStringLiterals: true }],

				'vars-on-top': 'error',
				yoda: 'error',
			},
		},
	];

	if (imports) {
		configs.push(
			{
				name: CORE_CONFIG_NAME_RULES_IMPORTS_WARNINGS,
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
				name: CORE_CONFIG_NAME_RULES_IMPORTS_STATIC,
				rules: {
					// Static analysis rules https://github.com/un-ts/eslint-plugin-import-x?tab=readme-ov-file#static-analysis
					[`${importXPluginRename}/named`]: 'error',
					[`${importXPluginRename}/namespace`]: 'error',
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
			}
		);
		if (markdown) {
			configs.push({
				files: json ? GLOB_MARKDOWN_SOURCE_WITH_JSON : GLOB_MARKDOWN_SOURCE,
				name: CORE_CONFIG_NAME_RULES_IMPORTS_STATIC_MARKDOWN_SOURCE,
				rules: {
					'import/no-unresolved': 'off',
				},
			});
		}
	}

	if (node) {
		configs.push({
			name: CORE_CONFIG_NAME_RULES_NODE,
			rules: {
				[`${nodePluginName}/handle-callback-err`]: ['error', '^(err|error)$'],
				[`${nodePluginName}/no-exports-assign`]: 'error',
				[`${nodePluginName}/no-new-require`]: 'error',
				...(useNodeModules && {
					[`${nodePluginName}/no-deprecated-api`]: 'error',
					[`${nodePluginName}/no-path-concat`]: 'error',
					[`${nodePluginName}/prefer-global/buffer`]: ['error', 'never'],
					[`${nodePluginName}/prefer-global/process`]: ['error', 'never'],
					[`${nodePluginName}/process-exit-as-throw`]: 'error',
				}),
			},
		});
	}

	if (markdown) {
		configs.push({
			files: GLOB_MARKDOWN_SOURCE,
			name: CORE_CONFIG_NAME_RULES_MARKDOWN_SOURCE,
			rules: {
				'line-comment-position': 'off',
				'multiline-comment-style': 'off',
				'no-inline-comments': 'off',
			},
		});
	}

	return configs;
}
