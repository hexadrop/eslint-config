import { interopDefault } from '@hexadrop/eslint-config-shared';

import { JSON_CONFIG_NAME_RULES, JSON_CONFIG_NAME_SETUP, JSON_CONFIG_NAME_SETUP_PARSER } from './json.config-name';
import { GLOB_JSON } from './json.globs';
import type { TypedFlatConfigItem } from './types';

export default async function json(options: { json: boolean }): Promise<TypedFlatConfigItem[]> {
	const { json: enabled } = options;
	if (!enabled) {
		return [];
	}

	const [pluginJsonc, parserJsonc] = await Promise.all([
		interopDefault(import('eslint-plugin-jsonc')),
		interopDefault(import('jsonc-eslint-parser')),
	] as const);

	const jsonPluginRename = 'json';

	return [
		{
			name: JSON_CONFIG_NAME_SETUP,
			plugins: {
				[jsonPluginRename]: pluginJsonc,
			},
		},
		{
			files: GLOB_JSON,
			languageOptions: {
				parser: parserJsonc,
			},
			name: JSON_CONFIG_NAME_SETUP_PARSER,
		},
		{
			files: GLOB_JSON,
			name: JSON_CONFIG_NAME_RULES,
			rules: {
				[`${jsonPluginRename}/no-bigint-literals`]: 'error',
				[`${jsonPluginRename}/no-binary-expression`]: 'error',
				[`${jsonPluginRename}/no-binary-numeric-literals`]: 'error',
				[`${jsonPluginRename}/no-dupe-keys`]: 'error',
				[`${jsonPluginRename}/no-escape-sequence-in-identifier`]: 'error',
				[`${jsonPluginRename}/no-floating-decimal`]: 'error',
				[`${jsonPluginRename}/no-hexadecimal-numeric-literals`]: 'error',
				[`${jsonPluginRename}/no-infinity`]: 'error',
				[`${jsonPluginRename}/no-multi-str`]: 'error',
				[`${jsonPluginRename}/no-nan`]: 'error',
				[`${jsonPluginRename}/no-number-props`]: 'error',
				[`${jsonPluginRename}/no-numeric-separators`]: 'error',
				[`${jsonPluginRename}/no-octal-escape`]: 'error',
				[`${jsonPluginRename}/no-octal-numeric-literals`]: 'error',
				[`${jsonPluginRename}/no-octal`]: 'error',
				[`${jsonPluginRename}/no-parenthesized`]: 'error',
				[`${jsonPluginRename}/no-plus-sign`]: 'error',
				[`${jsonPluginRename}/no-regexp-literals`]: 'error',
				[`${jsonPluginRename}/no-sparse-arrays`]: 'error',
				[`${jsonPluginRename}/no-template-literals`]: 'error',
				[`${jsonPluginRename}/no-undefined-value`]: 'error',
				[`${jsonPluginRename}/no-unicode-codepoint-escapes`]: 'error',
				[`${jsonPluginRename}/no-useless-escape`]: 'error',
				[`${jsonPluginRename}/space-unary-ops`]: 'error',
				[`${jsonPluginRename}/valid-json-number`]: 'error',
				[`${jsonPluginRename}/vue-custom-block/no-parsing-error`]: 'error',
			},
		},
	];
}
