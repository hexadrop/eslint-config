const renamePlugins = {
	'@stylistic': 'style',
	'@typescript-eslint': 'typescript',
	'import-x': 'import',
	'simple-import-sort': 'import-sort',
	'unused-imports': 'import-unused',
	jsonc: 'json',
	n: 'node',
	vitest: 'test',
	yml: 'yaml',
} as const;

export default renamePlugins;
