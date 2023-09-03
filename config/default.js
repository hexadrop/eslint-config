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
	extends: [
		'eslint:recommended',
		'plugin:prettier/recommended',
		'plugin:md/recommended',
		'plugin:jsonc/recommended-with-jsonc',
		'plugin:jsonc/prettier',
	],
	rules: {
		...eslintRules,
		...prettierRules,
		...importRules,
	},
	overrides: [
		{
			files: ['*.json', '*.json5', '*.jsonc'],
			parser: 'jsonc-eslint-parser',
			rules: {
				'jsonc/auto': 'error',
				'jsonc/array-bracket-newline': 'error',
			},
		},
		{
			files: ['package.json'],
			rules: {
				'jsonc/sort-keys': [
					'error',
					// For example, a definition for package.json
					{
						pathPattern: '^$',
						order: [
							'name',
							'version',
							'description',
							'keywords',
							'homepage',
							'bugs',
							'repository',
							'license',
							'private',
							'publishConfig',
							'files',
							'main',
							'module',
							'types',
							'exports',
							'typesVersions',
							'scripts',
							'dependencies',
							'peerDependencies',
							'peerDependenciesMeta',
							'devDependencies',
							'volta',
							'packageManager',
						],
					},
					{
						pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
						order: { type: 'asc' },
					},
					// ...
				],
			},
		},
		{
			files: ['*.md'],
			parser: 'markdown-eslint-parser',
			rules: {
				'md/remark': [
					'error',
					{
						plugins: [['lint-maximum-line-length', 120]],
					},
				],
				'prettier/prettier': ['error', { parser: 'markdown' }],
			},
		},
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
