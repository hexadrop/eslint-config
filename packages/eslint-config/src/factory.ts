import { astro } from '@hexadrop/eslint-config-astro';
import { json } from '@hexadrop/eslint-config-json';
import { markdown } from '@hexadrop/eslint-config-markdown';
import { react } from '@hexadrop/eslint-config-react';
import type { RecursivePartial } from '@hexadrop/eslint-config-shared';
import { extractTypedFlatConfigItem, PLUGIN_RENAME } from '@hexadrop/eslint-config-shared';
import { typescript } from '@hexadrop/eslint-config-typescript';
import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import { core, ignore, imports, stylistic } from './config';
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
		astro({ astro: options.astro, peerCheck: false, typescript: Boolean(options.typescript) }),
		typescript(options),
		react({ peerCheck: false, react: options.react, typescript: Boolean(options.typescript) }),
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
