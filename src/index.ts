import process from 'node:process';

import { FlatConfigComposer } from 'eslint-flat-config-utils';

import { gitignore, imports, javascript, json, perfectionist, stylistic, typescript } from './config';
import type { HexatoolEslintOptions } from './options';
import type { Awaitable, TypedFlatConfigItem } from './types';

const defaultPluginRenaming = {
	'@stylistic': 'style',
	'@typescript-eslint': 'typescript',
	'import-x': 'import',
	jsonc: 'json',
	n: 'node',
	'simple-import-sort': 'import-sort',
	vitest: 'test',
	yml: 'yaml',
};

function isEditor() {
	return Boolean(
		(process.env.VSCODE_PID || process.env.VSCODE_CWD || process.env.JETBRAINS_IDE || process.env.VIM)
		&& !process.env.CI,
	);
}

export default async function hexatool(
	options: HexatoolEslintOptions = {},
): Promise<FlatConfigComposer<TypedFlatConfigItem>> {
	const {
		autoRenamePlugins = true,
		isInEditor = isEditor(),
	} = options;

	const stylisticOptions = options.stylistic === false
		? false
		: typeof options.stylistic === 'object'
			? options.stylistic
			: {};

	const configs: Awaitable<TypedFlatConfigItem[]>[] = [
		gitignore(options.gitignore),
		javascript(options.javascript, isInEditor),
		imports(stylisticOptions),
		typescript(options.typescript, stylisticOptions),
		stylistic(stylisticOptions),
		json(options.json, stylisticOptions),
		perfectionist(options.perfectionist),
	];

	let pipeline = new FlatConfigComposer<TypedFlatConfigItem>();

	pipeline = pipeline
		.append(
			...configs,
		);

	if (autoRenamePlugins) {
		pipeline = pipeline
			.renamePlugins(defaultPluginRenaming);
	}

	return pipeline;
}
