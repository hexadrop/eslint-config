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
		{
			// Define the configuration for `.astro` file.
			files: ['*.astro'],
			// Enable this plugin
			plugins: ['astro'],
			env: {
				// Enables global variables available in Astro components.
				node: true,
				'astro/astro': true,
				es2020: true,
			},
			// Allows Astro components to be parsed.
			parser: 'astro-eslint-parser',
			/*
			 * Parse the script in `.astro` as TypeScript by adding the following configuration.
			 * It's the setting you need when using TypeScript.
			 */
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro'],
				// The script of Astro components uses ESM.
				sourceType: 'module',
			},
			rules: {
				'astro/no-conflict-set-directives': 'error',
				'astro/no-deprecated-astro-canonicalurl': 'error',
				'astro/no-deprecated-astro-fetchcontent': 'error',
				'astro/no-deprecated-astro-resolve': 'error',
				'astro/no-deprecated-getentrybyslug': 'error',
				'astro/no-unused-define-vars-in-style': 'error',
				'astro/valid-compile': 'error',
			},
		},
		{
			/*
			 * Define the configuration for `<script>` tag.
			 * Script in `<script>` is assigned a virtual file name with the `.js` extension.
			 */
			files: ['**/*.astro/*.js', '*.astro/*.js'],
			env: {
				browser: true,
				es2020: true,
			},
			parserOptions: {
				sourceType: 'module',
			},
			rules: {
				/*
				 * Override/add rules settings here, such as:
				 * "no-unused-vars": "error"
				 */

				/*
				 * If you are using "prettier/prettier" rule,
				 * you don't need to format inside <script> as it will be formatted as a `.astro` file.
				 */
				'prettier/prettier': 'off',
			},
		},
	],
};
