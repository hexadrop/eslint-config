const typescriptRules = require('../rules/typescript.rules.js');

module.exports = {
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
};
