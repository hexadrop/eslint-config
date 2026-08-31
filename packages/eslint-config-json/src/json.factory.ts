import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import type { HexadropEslintJsonOptions } from './json.config';
import jsonConfig from './json.config';
import type { TypedFlatConfigItem } from './json.typed-config';
import type { ConfigNames } from './typegen';

// eslint-disable-next-line typescript/promise-function-async
export default function jsonFactory(
	options?: HexadropEslintJsonOptions,
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(
		jsonConfig({ json: options?.json ?? true })
	);

	pipeline = pipeline.append(...configs);

	return pipeline;
}
