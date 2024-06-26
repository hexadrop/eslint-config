import globals from 'globals';

import { PLUGIN_RENAME } from '../../const';
import type { HexadropEslintOptions } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import { GLOB_MARKDOWN_SOURCE } from '../markdown';
import {
	CORE_CONFIG_NAME_RULES,
	CORE_CONFIG_NAME_RULES_MARKDOWN_SOURCE,
	CORE_CONFIG_NAME_RULES_NODE,
	CORE_CONFIG_NAME_SETUP,
} from './core.config-name';

export default async function core(options: HexadropEslintOptions): Promise<TypedFlatConfigItem[]> {
	const {
		markdown,
		module: { node: useNodeModules },
		node,
	} = options;

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
				...(node && {
					[nodePluginName]: await interopDefault(import('eslint-plugin-n')),
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
				'max-depth': ['error', 4],
				'max-params': 'off',
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
				'no-console': 'off',
				'no-inline-comments': 'off',
			},
		});
	}

	return configs;
}
