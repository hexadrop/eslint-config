import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import { core, ignore, imports, node, stylistic, typescript } from './config';
import markdown from './config/markdown/markdown.config';
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
		core(),
		typescript(options.typescript),
		imports(options.imports, options.core, options.typescript),
		node(options.node),
		markdown(options.markdown),
		stylistic(options.stylistic, options.typescript)
	).renamePlugins(PLUGIN_RENAME);

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
