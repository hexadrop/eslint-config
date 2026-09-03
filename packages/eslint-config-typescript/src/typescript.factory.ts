import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import type { ConfigNames } from './typegen';
import type { TypescriptFactoryOptions } from './typescript.config';
import typescriptConfig from './typescript.config';
import type { TypedFlatConfigItem } from './typescript.typed-config';

// eslint-disable-next-line typescript/promise-function-async
export default function typescriptFactory(
	options?: TypescriptFactoryOptions,
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(typescriptConfig(options));

	if (configs.length > 0) {
		pipeline = pipeline.append(...configs);
	}

	return pipeline;
}
