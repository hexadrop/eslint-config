import type { Linter } from 'eslint';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import type { HexatoolEslintOptions } from './options';
import type { Awaitable, TypedFlatConfigItem } from './types';
import { extractTypedFlatConfigItem } from './utils';


const defaultRenamePlugins = {
	'@stylistic': 'style',
	'@typescript-eslint': 'typescript',
	'import-x': 'import',
	jsonc: 'json',
	n: 'node',
	'simple-import-sort': 'import-sort',
	vitest: 'test',
	yml: 'yaml',
} as const;

export default async function hexatool(
	options: HexatoolEslintOptions & TypedFlatConfigItem = {},
	...userConfigs:
		Awaitable<
			| FlatConfigComposer<any>
			| Linter.FlatConfig[]
			| TypedFlatConfigItem
			| TypedFlatConfigItem[]
		>[]
): Promise<FlatConfigComposer<TypedFlatConfigItem>> {
	const {
		renamePlugins = true,
	} = options;

	const renamePluginsMap = {
		...defaultRenamePlugins,
		...(typeof renamePlugins === 'object' ? renamePlugins : {}),
	};

	const configs: Awaitable<TypedFlatConfigItem[]>[] = [];

	let pipeline = new FlatConfigComposer<TypedFlatConfigItem>(...configs);

	/*
	 * User can optionally pass a flat config item to the first argument
	 * We extract it and append it to the pipeline
	 */
	const flatConfig = extractTypedFlatConfigItem(options);
	if (flatConfig) {
		pipeline = pipeline.append(flatConfig);
	}

	if (userConfigs) {
		pipeline = pipeline.append(...userConfigs as any);
	}

	if (renamePlugins) {
		pipeline = pipeline.renamePlugins(renamePluginsMap);
	}

	return pipeline;
}
