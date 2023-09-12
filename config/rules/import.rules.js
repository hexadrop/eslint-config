module.exports = {
	// Import plugin
	'import/first': 'error',
	'import/newline-after-import': 'error',
	'import/no-empty-named-blocks': 'error',
	'import/no-duplicates': 'error',
	'import/no-extraneous-dependencies': 'off',
	// Disabled due an incompatibility with package.json exports. See: https://github.com/import-js/eslint-plugin-import/issues/2703
	'import/no-mutable-exports': 'off',
	'import/no-named-as-default': 'off',
	'import/no-named-as-default-member': 'off',
	'import/no-unresolved': 'off',
	'import/no-webpack-loader-syntax': 'error',
	'import/default': 'error',
	'import/named': 'error',
	'import/namespace': 'error',
	'import/no-absolute-path': 'error',
	'import/no-useless-path-segments': 'error',
	'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
	'import/exports-last': 'error',
	'import/group-exports': 'error',
	'import/no-anonymous-default-export': 'error',
	'import/no-namespace': 'error',
	'import/prefer-default-export': 'error',

	// Simple import sort plugin
	'simple-import-sort/exports': 'error',
	'simple-import-sort/imports': 'error',

	// Unused imports plugin
	'unused-imports/no-unused-imports': 'error',
	'unused-imports/no-unused-vars': [
		'warn',
		{
			vars: 'all',
			varsIgnorePattern: '^_',
			args: 'after-used',
			argsIgnorePattern: '^_',
		},
	],
};
