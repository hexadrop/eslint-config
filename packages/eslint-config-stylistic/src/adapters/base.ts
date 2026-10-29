import { GLOB_MARKDOWN_ASTRO, GLOB_MARKDOWN_JSON, GLOB_MARKDOWN_SOURCE } from '@hexadrop/eslint-config-core';
import {
	interopDefault,
	PLUGIN_RENAME,
	renameRules,
	STYLISTIC_CONFIG_NAME_RULES,
	STYLISTIC_CONFIG_NAME_RULES_MARKDOWN_SOURCE,
	STYLISTIC_CONFIG_NAME_SETUP,
} from '@hexadrop/eslint-config-shared';
import type { Linter } from 'eslint';

import type { StylisticConfigOptions } from '../stylistic.options';
import stylisticOptions from '../stylistic.options-stylistic';
import type { TypedFlatConfigItem } from '../stylistic.typed-config';

export default async function baseAdapter(options: StylisticConfigOptions): Promise<TypedFlatConfigItem[]> {
	const { astro, format, json, markdown, perfectionist, stylistic, unicorn } = options;
	const stylisticPluginRename = PLUGIN_RENAME['@stylistic'];

	const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));
	const pluginStylisticConfig = pluginStylistic.configs.customize(stylisticOptions(stylistic));
	const pluginStylisticRules = pluginStylisticConfig.rules as Linter.RulesRecord;

	const pluginUnicorn = unicorn ? await interopDefault(import('eslint-plugin-unicorn')) : undefined;
	const pluginPerfectionistRoot = perfectionist
		? await interopDefault(import('eslint-plugin-perfectionist'))
		: undefined;
	const pluginPerfectionist = pluginPerfectionistRoot?.configs['recommended-natural'];
	const pluginFormat = format ? await interopDefault(import('eslint-plugin-format')) : undefined;

	const config: TypedFlatConfigItem[] = [
		{
			name: STYLISTIC_CONFIG_NAME_SETUP,
			plugins: {
				style: pluginStylistic,
				...(pluginUnicorn && {
					unicorn: pluginUnicorn,
				}),
				...(pluginPerfectionist && {
					...pluginPerfectionist.plugins,
				}),
				...(pluginFormat && {
					format: pluginFormat,
				}),
			},
		},
		{
			name: STYLISTIC_CONFIG_NAME_RULES,
			rules: {
				...renameRules(pluginStylisticRules, PLUGIN_RENAME),
				[`${stylisticPluginRename}/arrow-parens`]: ['error', 'as-needed'],
				[`${stylisticPluginRename}/brace-style`]: 'off',
				[`${stylisticPluginRename}/implicit-arrow-linebreak`]: 'off',
				[`${stylisticPluginRename}/indent-binary-ops`]: 'off',
				[`${stylisticPluginRename}/indent`]: 'off',
				[`${stylisticPluginRename}/jsx-closing-bracket-location`]: [
					'error',
					{
						nonEmpty: 'after-props',
						selfClosing: 'tag-aligned',
					},
				],
				[`${stylisticPluginRename}/jsx-curly-newline`]: 'off',
				[`${stylisticPluginRename}/jsx-indent`]: 'off',
				[`${stylisticPluginRename}/jsx-one-expression-per-line`]: 'off',
				[`${stylisticPluginRename}/jsx-quotes`]: ['error', 'prefer-single'],
				[`${stylisticPluginRename}/line-comment-position`]: ['error', { position: 'above' }],
				[`${stylisticPluginRename}/max-len`]: 'off',
				[`${stylisticPluginRename}/multiline-comment-style`]: ['error', 'starred-block'],
				[`${stylisticPluginRename}/multiline-ternary`]: 'off',
				[`${stylisticPluginRename}/no-extra-semi`]: 'error',
				[`${stylisticPluginRename}/padding-line-between-statements`]: [
					'error',
					{ blankLine: 'always', next: 'return', prev: '*' },
				],
				curly: ['error', 'all'],
				...(format && {
					[`${stylisticPluginRename}/operator-linebreak`]: 'off',
				}),
			},
		},
	];

	if (markdown) {
		config.push({
			files: [
				...GLOB_MARKDOWN_SOURCE,
				...(json ? GLOB_MARKDOWN_JSON : []),
				...(astro ? GLOB_MARKDOWN_ASTRO : []),
			],
			name: STYLISTIC_CONFIG_NAME_RULES_MARKDOWN_SOURCE,
			rules: {
				[`${stylisticPluginRename}/indent`]: ['error', 2],
				[`${stylisticPluginRename}/line-comment-position`]: 'off',
				[`${stylisticPluginRename}/multiline-comment-style`]: 'off',
			},
		});
	}

	return config;
}
