import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import reactConfig from './react.config';
import type { TypedFlatConfigItem } from './react.typed-config';
import type { ReactConfigOptions } from './react.types';
import type { ConfigNames } from './typegen';

// eslint-disable-next-line typescript/promise-function-async
export default function reactFactory(
	options: ReactConfigOptions = {},
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(reactConfig(options));

	pipeline = pipeline.append(...configs);

	return pipeline;
}
