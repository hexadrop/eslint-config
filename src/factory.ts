import type { Linter } from 'eslint';
import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { renamePlugins } from './const';

import type { HexatoolEslintOptions } from './options';
import type { Awaitable, TypedFlatConfigItem } from './types';
import { extractTypedFlatConfigItem } from './utils';
import { ignore, core, imports } from './config';

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

	const configs: Awaitable<TypedFlatConfigItem[]>[] = [
		ignore(options.ignore),
		core(options.core),
		imports(options.imports, options.node, options.typescript),
	];

	let pipeline = new FlatConfigComposer<TypedFlatConfigItem>(...configs)
		.renamePlugins(renamePlugins);

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
