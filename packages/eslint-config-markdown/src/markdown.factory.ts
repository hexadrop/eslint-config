import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import markdownConfig from './markdown.config';
import type { TypedFlatConfigItem } from './markdown.typed-config';
import type { ConfigNames } from './typegen';

// eslint-disable-next-line typescript/promise-function-async
export default function markdownFactory(
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(markdownConfig());

	pipeline = pipeline.append(...configs);

	return pipeline;
}
