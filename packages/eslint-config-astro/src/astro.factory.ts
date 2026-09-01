import { extractTypedFlatConfigItem } from '@hexadrop/eslint-config-shared';
import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import type { HexadropEslintAstroOptions } from './astro.config';
import astroConfig from './astro.config';
import type { TypedFlatConfigItem } from './astro.typed-config';
import type { ConfigNames } from './typegen';

// eslint-disable-next-line typescript/promise-function-async
export default function astroFactory(
	optionsOrFlatConfigItem?: HexadropEslintAstroOptions & TypedFlatConfigItem,
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(
		astroConfig({
			astro: optionsOrFlatConfigItem?.astro ?? true,
			peerCheck: optionsOrFlatConfigItem?.peerCheck,
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
