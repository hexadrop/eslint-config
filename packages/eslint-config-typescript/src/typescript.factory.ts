import type { RecursivePartial } from '@hexadrop/eslint-config-shared';
import { extractTypedFlatConfigItem } from '@hexadrop/eslint-config-shared';
import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import type { ConfigNames } from './typegen';
import type { TypescriptFactoryOptions } from './typescript.config';
import typescriptConfig from './typescript.config';
import type { TypedFlatConfigItem } from './typescript.typed-config';

// eslint-disable-next-line typescript/promise-function-async
export default function typescriptFactory(
	optionsOrFlatConfigItem?: RecursivePartial<TypescriptFactoryOptions> & TypedFlatConfigItem,
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(
		typescriptConfig(optionsOrFlatConfigItem as TypescriptFactoryOptions | undefined)
	);

	/*
	 * User can optionally pass a flat config item to the first argument
	 * We extract it and append it to the pipeline
	 */
	const flatConfig = extractTypedFlatConfigItem(optionsOrFlatConfigItem);
	if (flatConfig) {
		pipeline = pipeline.append(flatConfig);
	}

	if (configs.length > 0) {
		pipeline = pipeline.append(...configs);
	}

	return pipeline;
}
