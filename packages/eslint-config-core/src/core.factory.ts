import { extractTypedFlatConfigItem } from '@hexadrop/eslint-config-shared';
import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import coreConfig from './core.config';
import type { CoreFactoryOptions } from './core.options';
import defaultCoreOptions from './core.options';
import type { TypedFlatConfigItem } from './core.typed-config';
import ignoreConfig from './ignore.config';
import importsConfig from './imports.config';
import type { ConfigNames } from './typegen';

// eslint-disable-next-line typescript/promise-function-async
export default function coreFactory(
	optionsOrFlatConfigItem?: CoreFactoryOptions,
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	const options = defaultCoreOptions(optionsOrFlatConfigItem);

	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(
		ignoreConfig(options),
		coreConfig(options),
		importsConfig(options)
	);

	const flatConfig = extractTypedFlatConfigItem(optionsOrFlatConfigItem);
	if (flatConfig) {
		pipeline = pipeline.append(flatConfig);
	}

	pipeline = pipeline.append(...configs);

	return pipeline;
}
