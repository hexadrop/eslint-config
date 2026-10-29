import {
	GLOB_JSON,
	GLOB_MARKDOWN_JSON,
	PLUGIN_RENAME,
	STYLISTIC_CONFIG_NAME_RULES_JSON,
	STYLISTIC_CONFIG_NAME_RULES_MARKDOWN_JSON,
} from '@hexadrop/eslint-config-shared';

import type { StylisticConfigOptions } from '../stylistic.options';
import type { TypedFlatConfigItem } from '../stylistic.typed-config';

/**
 * JSON concern: the stylistic rules for JSON files plus the `package.json` and
 * `tsconfig.json` sort-keys slice owned by `@hexadrop/eslint-config-json`.
 *
 * The sort-keys slice is imported lazily so this package never takes part in
 * the same module resolution pass as the meta-package's own dynamic import of
 * `-json` (jiti resolves the two concurrent loads to a partially-initialised
 * module).
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
 * JSON overrides for markdown JSON code blocks. Emitted after the formatting
 * concern, matching the historical order of the resolved config.
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
