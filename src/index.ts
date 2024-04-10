import { FlatConfigComposer } from 'eslint-flat-config-utils';
import process from 'node:process';
import { javascript } from './config';
import type { Awaitable, HexatoolEslintOptions, TypedFlatConfigItem } from './types';
import { getOverrides } from './utils';

const defaultPluginRenaming = {
	'@stylistic': 'style',
	'@typescript-eslint': 'typescript',
	'import-x': 'import',
	'n': 'node',
	'vitest': 'test',
	'yml': 'yaml',
}

export default function hexatool(options: HexatoolEslintOptions = {}) {
	const {
		autoRenamePlugins = true,
		isInEditor = !!((process.env['VSCODE_PID'] || process.env['VSCODE_CWD'] || process.env['JETBRAINS_IDE'] || process.env['VIM']) && !process.env['CI']),
	} = options;

	const configs: Awaitable<TypedFlatConfigItem[]>[] = [];

	configs.push(
		javascript({
			isInEditor,
			overrides: getOverrides(options, 'javascript'),
		})
	);

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
