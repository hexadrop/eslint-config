import type { Linter } from 'eslint';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import { core, ignore, imports, typescript } from './config';
import PLUGIN_MAP from './const/plugin-rename';
import type { HexatoolEslintOptions } from './options';
import type { Awaitable, TypedFlatConfigItem } from './types';
import { extractTypedFlatConfigItem } from './utils';

export default function hexatool(
	options: HexatoolEslintOptions & TypedFlatConfigItem = {},
	...userConfigs:
		Awaitable<
			| FlatConfigComposer<any>
			| Linter.FlatConfig[]
			| TypedFlatConfigItem
			| TypedFlatConfigItem[]
		>[]
): FlatConfigComposer<TypedFlatConfigItem> {

	const configs: Awaitable<TypedFlatConfigItem[]>[] = [
		ignore(options.ignore),
		core(options.core),
		typescript(options.typescript),
		imports(options.imports, options.node, options.typescript),
	];

	let pipeline = new FlatConfigComposer<TypedFlatConfigItem>(...configs)
		.renamePlugins(PLUGIN_MAP);

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

	return pipeline;
}
