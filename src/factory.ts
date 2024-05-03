import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import { core, ignore, imports, node, typescript } from './config';
import { PLUGIN_RENAME } from './const';
import type { HexatoolEslintOptions } from './options';
import type { TypedFlatConfigItem } from './types';
import { extractTypedFlatConfigItem } from './utils';

// eslint-disable-next-line typescript/promise-function-async
export default function hexatool(
	options: HexatoolEslintOptions & TypedFlatConfigItem = {},
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem> {

	let pipeline = new FlatConfigComposer<TypedFlatConfigItem>(
		ignore(options.ignore),
		core(options.core),
		typescript(options.typescript),
		imports(options.imports, options.node, options.typescript),
		node(options.node),
	)
		.renamePlugins(PLUGIN_RENAME);

	/*
	 * User can optionally pass a flat config item to the first argument
	 * We extract it and append it to the pipeline
	 */
	const flatConfig = extractTypedFlatConfigItem(options);
	if (flatConfig) {
		pipeline = pipeline.append(flatConfig);
	}

	pipeline = pipeline.append(...configs);

	return pipeline;
}
