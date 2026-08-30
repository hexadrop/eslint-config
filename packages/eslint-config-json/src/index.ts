import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import json from './json.config';
import type { ConfigNames } from './typegen';
import type { TypedFlatConfigItem } from './types';

interface HexadropEslintJsonOptions {
	/**
	 * Enable json support.
	 *
	 * @default true
	 */
	json: boolean;
}

export type { HexadropEslintJsonOptions };

// eslint-disable-next-line typescript/promise-function-async
export default function jsonConfig(
	options?: HexadropEslintJsonOptions,
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(json({ json: options?.json ?? true }));

	pipeline = pipeline.append(...configs);

	return pipeline;
}

export { default as json } from './json.config';
export type { JsonConfigNames } from './json.config-name';
export { JSON_CONFIG_NAME_RULES, JSON_CONFIG_NAME_SETUP, JSON_CONFIG_NAME_SETUP_PARSER } from './json.config-name';
export { GLOB_JSON, GLOB_JSON_PACKAGE, GLOB_JSON_TSCONFIG } from './json.globs';
export { default as JSON_SORT_KEYS_CONFIG } from './json.sort-keys';
export {
	STYLISTIC_CONFIG_NAME_RULES_JSON_PACKAGE,
	STYLISTIC_CONFIG_NAME_RULES_JSON_TSCONFIG,
} from './stylistic.config-name';
