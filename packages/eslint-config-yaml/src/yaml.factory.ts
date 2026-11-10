import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import type { ConfigNames } from './typegen';
import yamlConfig from './yaml.config';
import type { TypedFlatConfigItem } from './yaml.typed-config';

// eslint-disable-next-line typescript/promise-function-async
export default function yamlFactory(
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(yamlConfig());

	pipeline = pipeline.append(...configs);

	return pipeline;
}
