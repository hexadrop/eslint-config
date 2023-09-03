const eslintRules = require('./rules/eslint.rules.js');
const prettierRules = require('./rules/prettier.rules.js');
const importRules = require('./rules/import.rules.js');
const typescriptOverrides = require('./overrides/typescript.overrides.js');
const jsonOverrides = require('./overrides/json.overrides.js');
const packageJsonOverrides = require('./overrides/package.json.overrides.js');

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
	overrides: [typescriptOverrides, jsonOverrides, packageJsonOverrides],
};
