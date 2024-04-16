import globals from 'globals';
import { default as pluginUnusedImports } from 'eslint-plugin-unused-imports'

import type { IsInEditorOptions, OptionsOverrides } from '../../options';
import type { TypedFlatConfigItem } from '../../types';

export default function javascript(
	options: IsInEditorOptions & OptionsOverrides = {},
): TypedFlatConfigItem[] {

	const {
		isInEditor,
		overrides = {},
	} = options;

	return [
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
					ecmaVersion: 2022,
					sourceType: 'module',
				},
				sourceType: 'module',
			},
			linterOptions: {
				reportUnusedDisableDirectives: true,
			},
			name: 'hexatool/javascript/rules',
			plugins: {
				'unused-imports': pluginUnusedImports,
			},
			rules: {
				// Possible problems [eslint](https://eslint.org/docs/latest/rules/#possible-problems)
				'array-callback-return': ['error', { checkForEach: true }],
				'constructor-super': 'error',
				'for-direction': 'error',
				'getter-return': 'error',
				'no-async-promise-executor': 'error',
				'no-await-in-loop': 'error',
				'no-class-assign': 'error',
				'no-compare-neg-zero': 'error',
				'no-cond-assign': ['error', 'always'],
				'no-const-assign': 'error',
				'no-constant-binary-expression': 'error',
				'no-constant-condition': 'error',
				'no-constructor-return': 'error',
				'no-control-regex': 'error',
				'no-debugger': 'error',
				'no-dupe-args': 'error',
				'no-dupe-class-members': 'error',
				'no-dupe-else-if': 'error',
				'no-dupe-keys': 'error',
				'no-duplicate-case': 'error',
				'no-duplicate-imports': 'error',
				'no-empty-character-class': 'error',
				'no-empty-pattern': 'error',
				'no-ex-assign': 'error',
				'no-fallthrough': 'error',
				'no-func-assign': 'error',
				'no-import-assign': 'error',
				'no-inner-declarations': 'error',
				'no-invalid-regexp': 'error',
				'no-irregular-whitespace': 'error',
				'no-loss-of-precision': 'error',
				'no-misleading-character-class': 'error',
				'no-new-native-nonconstructor': 'error',
				'no-obj-calls': 'error',
				'no-promise-executor-return': 'error',
				'no-prototype-builtins': 'error',
				'no-self-assign': 'error',
				'no-self-compare': 'error',
				'no-setter-return': 'error',
				'no-sparse-arrays': 'error',
				'no-template-curly-in-string': 'error',
				'no-this-before-super': 'error',
				'no-undef': 'error',
				'no-unexpected-multiline': 'error',
				'no-unmodified-loop-condition': 'error',
				'no-unreachable': 'error',
				'no-unreachable-loop': 'error',
				'no-unsafe-finally': 'error',
				'no-unsafe-negation': 'error',
				'no-unsafe-optional-chaining': 'error',
				'no-unused-private-class-members': 'error',
				'no-unused-vars': 'error',
				'no-use-before-define': [
					'error',
					{
						functions: false,
						classes: true,
						variables: true,
						allowNamedExports: false,
					},
				],
				'no-useless-assignment': 'error',
				'no-useless-backreference': 'error',
				'require-atomic-updates': 'error',
				'use-isnan': ['error', { enforceForIndexOf: true, enforceForSwitchCase: true }],
				'valid-typeof': ['error', { requireStringLiterals: true }],

				// Suggestions [eslint](https://eslint.org/docs/latest/rules/#suggestions)
				'accessor-pairs': ['error', { enforceForClassMembers: true, setWithoutGet: true }],
				'block-scoped-var': 'error',
				camelcase: ['error', { properties: 'never' }],
				'capitalized-comments': 'error',
				complexity: ['error', 30],
				'consistent-this': ['error', 'self'],
				curly: 'error',
				'default-case-last': 'error',
				'dot-notation': 'error',
				eqeqeq: 'error',
				'func-name-matching': 'error',
				'func-names': ['error', 'as-needed'],
				'grouped-accessor-pairs': 'error',
				'guard-for-in': 'error',
				'max-depth': ['error', 4],
				'max-params': 'off',
				'multiline-comment-style': ['error', 'starred-block'],
				'new-cap': ['error', { capIsNew: false }],
				'no-alert': 'error',
				'no-array-constructor': 'error',
				'no-bitwise': 'error',
				'no-caller': 'error',
				'no-case-declarations': 'error',
				"no-delete-var": "error",
				'no-eq-null': 'error',
				'no-console': ['error', { allow: ['error'] }],
				'no-else-return': ['error', { allowElseIf: false }],
				'no-empty': 'error',
				'no-empty-static-block': 'error',
				'no-eval': 'error',
				'no-extend-native': 'error',
				'no-extra-bind': 'error',
				"no-extra-boolean-cast": "error",
				'no-extra-label': 'error',
				'no-global-assign': 'error',
				'no-floating-decimal': 'error', // TODO: Utilizar stylistic
				'no-implicit-coercion': 'error',
				'no-implicit-globals': 'error',
				'no-implied-eval': 'error',
				'no-inline-comments': 'error',
				'no-invalid-this': 'error',
				'no-iterator': 'error',
				'no-label-var': 'error',
				'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
				'no-multi-str': 'error',
				'no-lone-blocks': 'error',
				'no-loop-func': 'error',
				'no-lonely-if': 'error',
				'no-mixed-operators': 'error', // TODO: Utilizar stylistic
				'no-multi-assign': 'error',
				'no-negated-condition': 'error',
				'no-new': 'error',
				'no-new-func': 'error',
				'no-new-wrappers': 'error',
				'no-nonoctal-decimal-escape': 'error',
				'no-octal': 'error',
				'no-octal-escape': 'error',
				'no-param-reassign': 'error',
				'no-proto': 'error',
				'no-redeclare': 'error',
				'no-regex-spaces': 'error',
				'no-restricted-globals': [
					'error',
					{ message: 'Use `globalThis` instead.', name: 'global' },
					{ message: 'Use `globalThis` instead.', name: 'self' },
				],
				'no-restricted-properties': [
					'error',
					{ message: 'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.', property: '__proto__' },
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
				'no-sequences': 'error',
				'no-shadow-restricted-names': 'error',
				'no-throw-literal': 'error',
				'no-undef-init': 'error',
				'no-underscore-dangle': 'error',
				'no-unneeded-ternary': 'error',
				'no-unused-expressions': 'error',
				'no-unused-labels': 'error',
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
				'require-await': 'error',
				'require-yield': 'error',
				'quote-props': ['error', 'as-needed'], // TODO: Utilizar stylistic
				radix: 'error',
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
				'spaced-comment': ['error', 'always'], // TODO: Utilizar stylistic
				'symbol-description': 'error',
				'unicode-bom': ['error', 'never'],
				'vars-on-top': 'error',
				yoda: 'error',

				// Layout & Formatting [eslint](https://eslint.org/docs/latest/rules/#layout--formatting)
				'line-comment-position': ["error", { position: "above" }],
				'arrow-parens': ['error', 'as-needed'], // TODO: Utilizar stylistic
				'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }], // TODO: Utilizar stylistic
				'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }], // TODO: Utilizar stylistic

				// Unused imports plugin
				'unused-imports/no-unused-imports': isInEditor ? 'off' : 'error',
				'unused-imports/no-unused-vars': [
					'warn',
					{
						vars: 'all',
						varsIgnorePattern: '^_',
						args: 'after-used',
						argsIgnorePattern: '^_',
						ignoreRestSiblings: true,
					},
				],
				...overrides,
			},
		},
	];
}
