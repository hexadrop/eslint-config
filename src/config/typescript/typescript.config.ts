import { PLUGIN_RENAME, PLUGIN_RENAME_TYPESCRIPT } from '../../const';
import type { HexadropEslintOptions } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault, pluginConfigOverrideRules, pluginConfigRules, toArray } from '../../utils';
import { JAVASCRIPT_GLOBS, SOURCE_GLOBS } from '../core';
import { GLOB_MARKDOWN_SOURCE } from '../markdown';
import {
	TYPESCRIPT_CONFIG_NAME_RULES,
	TYPESCRIPT_CONFIG_NAME_RULES_DTS,
	TYPESCRIPT_CONFIG_NAME_RULES_TEST,
	TYPESCRIPT_CONFIG_NAME_RULES_TYPEAWARE,
	TYPESCRIPT_CONFIG_NAME_SETUP,
} from './typescript.config-name';
import { DTS_GLOBS, TEST_GLOBS, TYPESCRIPT_GLOBS } from './typescript.globs';
import typescriptParser from './typescript.parser';

export default async function typescript(options: HexadropEslintOptions): Promise<TypedFlatConfigItem[]> {
	const { typescript } = options;
	if (typescript === false) {
		return [];
	}

	const [plugin, parser] = await Promise.all([
		interopDefault(import('@typescript-eslint/eslint-plugin')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	const typescriptPluginRename = PLUGIN_RENAME['@typescript-eslint'];

	const config: TypedFlatConfigItem[] = [];
	const isTypeAware = typeof typescript !== 'boolean';

	// Install the plugins without globs, so they can be configured separately.
	config.push({
		name: TYPESCRIPT_CONFIG_NAME_SETUP,
		plugins: {
			typescript: plugin,
		},
	});

	if (typescript === true) {
		config.push(
			typescriptParser({
				files: SOURCE_GLOBS,
				parser,
			})
		);
	} else {
		config.push(
			typescriptParser({
				files: [...JAVASCRIPT_GLOBS, ...GLOB_MARKDOWN_SOURCE],
				parser,
			}),
			typescriptParser({
				files: TYPESCRIPT_GLOBS,
				ignores: GLOB_MARKDOWN_SOURCE,
				parser,
				tsconfigPath: toArray(typescript),
			})
		);
	}

	config.push(
		{
			files: SOURCE_GLOBS,
			name: TYPESCRIPT_CONFIG_NAME_RULES,
			rules: {
				...pluginConfigOverrideRules(plugin, 'eslint-recommended', PLUGIN_RENAME_TYPESCRIPT),
				...pluginConfigRules(plugin, 'strict', PLUGIN_RENAME_TYPESCRIPT),
				[`${typescriptPluginRename}/explicit-module-boundary-types`]: ['error'],
				[`${typescriptPluginRename}/no-extraneous-class`]: 'off',
				// Disable the following rules, as they are covered by the eslint-plugin-unused-imports
				[`${typescriptPluginRename}/no-unused-vars`]: 'off',
			},
		},
		{
			files: DTS_GLOBS,
			name: TYPESCRIPT_CONFIG_NAME_RULES_DTS,
			rules: {
				[`${typescriptPluginRename}/triple-slash-reference`]: 'off',
				'multiline-comment-style': 'off',
			},
		}
	);

	if (isTypeAware) {
		config.push({
			files: TYPESCRIPT_GLOBS,
			ignores: GLOB_MARKDOWN_SOURCE,
			name: TYPESCRIPT_CONFIG_NAME_RULES_TYPEAWARE,
			rules: {
				...pluginConfigRules(plugin, 'strict-type-checked-only', PLUGIN_RENAME_TYPESCRIPT),
				[`${typescriptPluginRename}/no-confusing-void-expression`]: ['error', { ignoreArrowShorthand: true }],
				[`${typescriptPluginRename}/no-unused-vars`]: 'off',
				[`${typescriptPluginRename}/prefer-readonly`]: ['error'],
				[`${typescriptPluginRename}/promise-function-async`]: ['error', { checkArrowFunctions: false }],
				[`${typescriptPluginRename}/switch-exhaustiveness-check`]: ['error'],
			},
		});
	}

	config.push({
		files: TEST_GLOBS,
		name: TYPESCRIPT_CONFIG_NAME_RULES_TEST,
		rules: {
			[`${typescriptPluginRename}/no-confusing-void-expression`]: 'off',
		},
	});

	return config;
}
