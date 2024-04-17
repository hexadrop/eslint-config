import process from 'node:process';

import { FlatConfigComposer } from 'eslint-flat-config-utils';

import { gitignore, imports, javascript } from './config';
import typescript from './config/typescript';
import type { HexatoolEslintOptions } from './options';
import type { Awaitable, TypedFlatConfigItem } from './types';

const defaultPluginRenaming = {
	'@stylistic': 'style',
	'@typescript-eslint': 'typescript',
	'import-x': 'import',
	'simple-import-sort': 'import-sort',
	n: 'node',
	vitest: 'test',
	yml: 'yaml',
}

export default async function hexatool(options: HexatoolEslintOptions = {}) {
	const {
		autoRenamePlugins = true,
		isInEditor = Boolean((process.env.VSCODE_PID || process.env.VSCODE_CWD || process.env.JETBRAINS_IDE || process.env.VIM) && !process.env.CI),
	} = options;


	const stylistic = options.stylistic === false
		? false
		: typeof options.stylistic === 'object'
			? options.stylistic
			: {}

	const configs: Awaitable<TypedFlatConfigItem[]>[] = [
		gitignore(options.gitignore),
		javascript(options.javascript, isInEditor),
		imports(stylistic),
		typescript(options.typescript, stylistic),
	];

	let pipeline = new FlatConfigComposer<TypedFlatConfigItem>()

	pipeline = pipeline
		.append(
			...configs
		)

	if (autoRenamePlugins) {
		pipeline = pipeline
			.renamePlugins(defaultPluginRenaming)
	}

	return pipeline;
}
