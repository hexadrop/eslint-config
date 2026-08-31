import { json } from '@hexadrop/eslint-config-json';
import type { RecursivePartial } from '@hexadrop/eslint-config-shared';
import { extractTypedFlatConfigItem, PLUGIN_RENAME } from '@hexadrop/eslint-config-shared';
import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import { astro, core, ignore, imports, markdown, react, stylistic, typescript } from './config';
import type { HexadropEslintOptions } from './options';
import defaultOptions from './options/hexadrop-eslint.options';
import type { TypedFlatConfigItem } from './typed-config';
import type { ConfigNames } from './typegen';

// eslint-disable-next-line typescript/promise-function-async
export default function hexadrop(
	optionsOrFlatConfigItem?: RecursivePartial<HexadropEslintOptions> & TypedFlatConfigItem,
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	const options = defaultOptions(optionsOrFlatConfigItem);

	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(
		ignore(options),
		core(options),
		astro(options),
		typescript(options),
		react(options),
		json(options),
		markdown(options),
		imports(options),
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
