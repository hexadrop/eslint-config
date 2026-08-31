import { extractTypedFlatConfigItem } from '@hexadrop/eslint-config-shared';
import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import type { HexadropEslintMarkdownOptions } from './markdown.config';
import markdownConfig from './markdown.config';
import type { TypedFlatConfigItem } from './markdown.typed-config';
import type { ConfigNames } from './typegen';

// eslint-disable-next-line typescript/promise-function-async
export default function markdownFactory(
	optionsOrFlatConfigItem?: HexadropEslintMarkdownOptions & TypedFlatConfigItem,
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(
		markdownConfig({ markdown: optionsOrFlatConfigItem?.markdown ?? true })
	);

	const flatConfig = extractTypedFlatConfigItem(optionsOrFlatConfigItem);
	if (flatConfig) {
		pipeline = pipeline.append(flatConfig);
	}

	pipeline = pipeline.append(...configs);

	return pipeline;
}
