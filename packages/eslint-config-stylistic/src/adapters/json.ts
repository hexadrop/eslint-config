import {
	GLOB_JSON,
	GLOB_MARKDOWN_JSON,
	PLUGIN_RENAME,
	STYLISTIC_CONFIG_NAME_RULES_JSON,
	STYLISTIC_CONFIG_NAME_RULES_MARKDOWN_JSON,
} from '@hexadrop/eslint-config-shared';

import type { StylisticConfigOptions } from '../stylistic.options';
import type { TypedFlatConfigItem } from '../stylistic.typed-config';

/*
 * Imported lazily so the meta-package's concurrent `-json` load doesn't resolve
 * to a partially initialised module in jiti.
 */
export default async function jsonAdapter(options: StylisticConfigOptions): Promise<TypedFlatConfigItem[]> {
	const { indent, indentSize } = options.stylistic;
	const jsonPluginRename = PLUGIN_RENAME.jsonc;

	const jsonPackage = await import('@hexadrop/eslint-config-json');

	return [
		{
			files: GLOB_JSON,
			name: STYLISTIC_CONFIG_NAME_RULES_JSON,
			rules: {
				[`${jsonPluginRename}/array-bracket-spacing`]: ['error', 'never'],
				[`${jsonPluginRename}/comma-dangle`]: ['error', 'never'],
				[`${jsonPluginRename}/comma-style`]: ['error', 'last'],
				[`${jsonPluginRename}/indent`]: ['error', indent === 'space' ? indentSize : indent],
				[`${jsonPluginRename}/key-spacing`]: ['error', { afterColon: true, beforeColon: false }],
				[`${jsonPluginRename}/object-curly-newline`]: ['error', { consistent: true, multiline: true }],
				[`${jsonPluginRename}/object-curly-spacing`]: ['error', 'always'],
				[`${jsonPluginRename}/object-property-newline`]: ['error', { allowMultiplePropertiesPerLine: true }],
				[`${jsonPluginRename}/quote-props`]: 'error',
				[`${jsonPluginRename}/quotes`]: 'error',
			},
		},
		...jsonPackage.JSON_SORT_KEYS_CONFIG,
	];
}

/**
 * Markdown JSON overrides; must stay after the format concern (frozen order).
 */
export function jsonMarkdownAdapter(): TypedFlatConfigItem[] {
	return [
		{
			files: GLOB_MARKDOWN_JSON,
			name: STYLISTIC_CONFIG_NAME_RULES_MARKDOWN_JSON,
			rules: {
				'json/indent': ['error', 2],
			},
		},
	];
}
