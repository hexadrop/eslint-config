import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import { core, ignore, markdown, stylistic, typescript } from './config';
import { PLUGIN_RENAME } from './const';
import type { HexatoolEslintOptions } from './options';
import defaultOptions from './options/hexatool-eslint.options';
import type { ConfigNames, TypedFlatConfigItem } from './types';
import { extractTypedFlatConfigItem } from './utils';

// eslint-disable-next-line typescript/promise-function-async
export default function hexatool(
	optionsOrFlatConfigItem?: HexatoolEslintOptions & TypedFlatConfigItem,
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	const options = defaultOptions(optionsOrFlatConfigItem);

	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(
		ignore(options),
		core(options),
		typescript(options),
		markdown(options),
		stylistic(options)
	).renamePlugins(PLUGIN_RENAME);

	/*
	 * User can optionally pass a flat config item to the first argument
	 * We extract it and append it to the pipeline
	 */
	const flatConfig = extractTypedFlatConfigItem(optionsOrFlatConfigItem);
	if (flatConfig) {
		pipeline = pipeline.append(flatConfig);
	}

	pipeline = pipeline.append(...configs);

	return pipeline;
}
