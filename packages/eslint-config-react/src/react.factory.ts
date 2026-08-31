import { extractTypedFlatConfigItem } from '@hexadrop/eslint-config-shared';
import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import type { HexadropEslintReactOptions } from './react.config';
import reactConfig from './react.config';
import type { TypedFlatConfigItem } from './react.typed-config';
import type { ConfigNames } from './typegen';

// eslint-disable-next-line typescript/promise-function-async
export default function reactFactory(
	optionsOrFlatConfigItem?: HexadropEslintReactOptions & TypedFlatConfigItem,
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(
		reactConfig({
			peerCheck: optionsOrFlatConfigItem?.peerCheck,
			react: optionsOrFlatConfigItem?.react ?? true,
			typescript: optionsOrFlatConfigItem?.typescript,
		})
	);

	const flatConfig = extractTypedFlatConfigItem(optionsOrFlatConfigItem);
	if (flatConfig) {
		pipeline = pipeline.append(flatConfig);
	}

	pipeline = pipeline.append(...configs);

	return pipeline;
}
