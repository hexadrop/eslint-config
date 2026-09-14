import { extractTypedFlatConfigItem } from '@hexadrop/eslint-config-shared';
import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import type { HexadropEslintStylisticOptions, StylisticFactoryOptions } from './stylistic.options';
import resolveOptions from './stylistic.resolve-options';
import stylisticConfig from './stylistic.config';
import type { TypedFlatConfigItem } from './stylistic.typed-config';
import type { ConfigNames } from './typegen';

// eslint-disable-next-line typescript/promise-function-async
export default function stylisticFactory(
	options?: Partial<StylisticFactoryOptions> & TypedFlatConfigItem,
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	const resolved = resolveOptions(options);

	const configSlice = resolved.stylistic === false
		? []
		: [
			stylisticConfig({
				astro: resolved.astro ?? false,
				isTypeAware: resolved.isTypeAware ?? false,
				json: resolved.json ?? false,
				markdown: resolved.markdown ?? false,
				stylistic: resolved.stylistic as HexadropEslintStylisticOptions,
				typescript: resolved.typescript ?? false,
			}),
		];

	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(
		...configSlice,
	);

	/*
	 * User can optionally pass a flat config item to the first argument
	 * We extract it and append it to the pipeline
	 */
	const flatConfig = extractTypedFlatConfigItem(options);
	if (flatConfig) {
		pipeline = pipeline.append(flatConfig);
	}

	pipeline = pipeline.append(...configs);

	return pipeline;
}