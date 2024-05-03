import type { Linter } from 'eslint';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import { core, ignore, imports, typescript } from './config';
import { PLUGIN_RENAME } from './const';
import type { HexatoolEslintOptions } from './options';
import type { Awaitable, TypedFlatConfigItem } from './types';
import { extractTypedFlatConfigItem } from './utils';

// eslint-disable-next-line typescript/promise-function-async
export default function hexatool(
	options: HexatoolEslintOptions & TypedFlatConfigItem = {},
	...userConfigs:
		Awaitable<
			// eslint-disable-next-line typescript/no-explicit-any
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
		.renamePlugins(PLUGIN_RENAME);

	/*
	 * User can optionally pass a flat config item to the first argument
	 * We extract it and append it to the pipeline
	 */
	const flatConfig = extractTypedFlatConfigItem(options);
	if (flatConfig) {
		pipeline = pipeline.append(flatConfig);
	}

	// eslint-disable-next-line typescript/no-explicit-any,typescript/no-unsafe-argument
	pipeline = pipeline.append(...userConfigs as any);

	return pipeline;
}
