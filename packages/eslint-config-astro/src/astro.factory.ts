import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import type { AstroConfigOptions } from './astro.config';
import astroConfig from './astro.config';
import type { TypedFlatConfigItem } from './astro.typed-config';
import type { ConfigNames } from './typegen';

// eslint-disable-next-line typescript/promise-function-async
export default function astroFactory(
	options: AstroConfigOptions = {},
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(astroConfig(options));

	pipeline = pipeline.append(...configs);

	return pipeline;
}
