import type { ESLint } from 'eslint';

import type { HexatoolEslintOptions } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import { JSON_CONFIG_NAME_RULES, JSON_CONFIG_NAME_SETUP, JSON_CONFIG_NAME_SETUP_PARSER } from './json.config-name';
import { GLOB_JSON } from './json.globs';

export default async function json(options: HexatoolEslintOptions): Promise<TypedFlatConfigItem[]> {
	const { json } = options;
	if (!json) {
		return [];
	}

	const [pluginJsonc, parserJsonc] = await Promise.all([
		interopDefault(import('eslint-plugin-jsonc')),
		interopDefault(import('jsonc-eslint-parser')),
	] as const);

	return [
		{
			name: JSON_CONFIG_NAME_SETUP,
			plugins: {
				json: pluginJsonc as unknown as ESLint.Plugin,
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
				'json/no-bigint-literals': 'error',
				'json/no-binary-expression': 'error',
				'json/no-binary-numeric-literals': 'error',
				'json/no-dupe-keys': 'error',
				'json/no-escape-sequence-in-identifier': 'error',
				'json/no-floating-decimal': 'error',
				'json/no-hexadecimal-numeric-literals': 'error',
				'json/no-infinity': 'error',
				'json/no-multi-str': 'error',
				'json/no-nan': 'error',
				'json/no-number-props': 'error',
				'json/no-numeric-separators': 'error',
				'json/no-octal': 'error',
				'json/no-octal-escape': 'error',
				'json/no-octal-numeric-literals': 'error',
				'json/no-parenthesized': 'error',
				'json/no-plus-sign': 'error',
				'json/no-regexp-literals': 'error',
				'json/no-sparse-arrays': 'error',
				'json/no-template-literals': 'error',
				'json/no-undefined-value': 'error',
				'json/no-unicode-codepoint-escapes': 'error',
				'json/no-useless-escape': 'error',
				'json/space-unary-ops': 'error',
				'json/valid-json-number': 'error',
				'json/vue-custom-block/no-parsing-error': 'error',
			},
		},
	];
}
