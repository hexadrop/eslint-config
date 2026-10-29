import { extractTypedFlatConfigItem } from '@hexadrop/eslint-config-shared';
import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import stylisticConfig from './stylistic.config';
import type { StylisticFactoryOptions } from './stylistic.options';
import resolveOptions from './stylistic.resolve-options';
import type { TypedFlatConfigItem } from './stylistic.typed-config';
import type { ConfigNames } from './typegen';

// eslint-disable-next-line typescript/promise-function-async
export default function stylisticFactory(
	options?: StylisticFactoryOptions & TypedFlatConfigItem,
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	const resolved = resolveOptions(options);

	const configSlice =
		resolved.stylistic === false
			? []
			: [
					stylisticConfig({
						astro: resolved.astro,
						format: resolved.format,
						isTypeAware: resolved.isTypeAware,
						json: resolved.json,
						markdown: resolved.markdown,
						perfectionist: resolved.perfectionist,
						stylistic: resolved.stylistic,
						typescript: resolved.typescript,
						unicorn: resolved.unicorn,
					}),
				];

	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(...configSlice);

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
