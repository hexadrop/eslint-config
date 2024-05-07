import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import { core, ignore, imports, node, stylistic, typescript } from './config';
import markdown from './config/markdown/markdown.config';
import { PLUGIN_RENAME } from './const';
import type { HexatoolEslintOptionsOld } from './options';
import type { ConfigNames, TypedFlatConfigItem } from './types';
import { extractTypedFlatConfigItem } from './utils';

// eslint-disable-next-line typescript/promise-function-async
export default function hexatool(
	options: HexatoolEslintOptionsOld & TypedFlatConfigItem = {},
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(
		ignore(options.ignore),
		core(),
		imports(options.imports, options.core, options.typescript),
		node(options.node),
		typescript(options.typescript),
		stylistic(options.stylistic, options.typescript),
		markdown(options.markdown)
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
