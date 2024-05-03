import PLUGIN_RENAME_TYPESCRIPT from './plugin-rename-typescript';

const PLUGIN_RENAME = {
	...PLUGIN_RENAME_TYPESCRIPT,
	'@stylistic': 'style',
	'import-x': 'import',
	'simple-import-sort': 'import-sort',
	'unused-imports': 'import-unused',
	jsonc: 'json',
	n: 'node',
	vitest: 'test',
	yml: 'yaml',
} as const;

export default PLUGIN_RENAME;
