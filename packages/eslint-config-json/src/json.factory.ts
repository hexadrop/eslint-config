import { extractTypedFlatConfigItem } from '@hexadrop/eslint-config-shared';
import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import type { HexadropEslintJsonOptions } from './json.config';
import jsonConfig from './json.config';
import type { TypedFlatConfigItem } from './json.typed-config';
import type { ConfigNames } from './typegen';

// eslint-disable-next-line typescript/promise-function-async
export default function jsonFactory(
	optionsOrFlatConfigItem?: HexadropEslintJsonOptions & TypedFlatConfigItem,
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(
		jsonConfig({ json: optionsOrFlatConfigItem?.json ?? true })
	);

	const flatConfig = extractTypedFlatConfigItem(optionsOrFlatConfigItem);
	if (flatConfig) {
		pipeline = pipeline.append(flatConfig);
	}

	pipeline = pipeline.append(...configs);

	return pipeline;
}
