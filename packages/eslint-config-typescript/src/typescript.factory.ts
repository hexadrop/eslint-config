import { extractTypedFlatConfigItem } from '@hexadrop/eslint-config-shared';
import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import type { ConfigNames } from './typegen';
import type { HexadropEslintTypescriptOptions } from './typescript.config';
import typescriptConfig from './typescript.config';
import type { TypedFlatConfigItem } from './typescript.typed-config';

// eslint-disable-next-line typescript/promise-function-async
export default function typescriptFactory(
	optionsOrFlatConfigItem: HexadropEslintTypescriptOptions & TypedFlatConfigItem = {},
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	const { tsconfigRootDir, typescript: tsOption } = optionsOrFlatConfigItem;
	const configOptions: HexadropEslintTypescriptOptions = {};
	if (tsOption !== undefined) {
		configOptions.typescript = tsOption;
	}
	if (tsconfigRootDir !== undefined) {
		configOptions.tsconfigRootDir = tsconfigRootDir;
	}
	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(
		typescriptConfig(Object.keys(configOptions).length > 0 ? configOptions : undefined)
	);

	const flatConfig = extractTypedFlatConfigItem(optionsOrFlatConfigItem);
	if (flatConfig) {
		pipeline = pipeline.append(flatConfig);
	}

	pipeline = pipeline.append(...configs);

	return pipeline;
}
