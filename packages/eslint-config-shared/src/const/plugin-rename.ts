import PLUGIN_RENAME_TYPESCRIPT from './plugin-rename-typescript';

const PLUGIN_RENAME = {
	...PLUGIN_RENAME_TYPESCRIPT,
	'@stylistic': 'style',
	'import-x': 'import',
	jsonc: 'json',
	n: 'node',
	'simple-import-sort': 'import-sort',
	'unused-imports': 'import-unused',
	vitest: 'test',
	yml: 'yaml',
} as const;

export default PLUGIN_RENAME;
