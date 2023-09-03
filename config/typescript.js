const eslintRules = require('./rules/eslint.rules.js');
const prettierRules = require('./rules/prettier.rules.js');
const importRules = require('./rules/import.rules.js');
const typescriptRules = require('./rules/typescript.rules.js');

module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: ['import', 'simple-import-sort', 'unused-imports'],
	extends: ['eslint:recommended', 'plugin:prettier/recommended'],
	rules: {
		...eslintRules,
		...prettierRules,
		...importRules,
	},
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			parserOptions: {
				project: ['./tsconfig.json'],
			},
			extends: [
				'plugin:@typescript-eslint/strict-type-checked',
				'plugin:@typescript-eslint/stylistic-type-checked',
				'plugin:import/typescript',
			],
			plugins: ['@typescript-eslint'],
			rules: typescriptRules,
		},
	],
};
