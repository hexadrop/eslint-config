import { PLUGIN_RENAME, PLUGIN_RENAME_TYPESCRIPT } from '../../const';
import type { HexatoolEslintOptions } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault, pluginConfigOverrideRules, toArray } from '../../utils';
import pluginConfigRules from '../../utils/plugin-config-rules';
import { SOURCE_GLOBS } from '../core';
import {
	TYPESCRIPT_CONFIG_NAME_RULES,
	TYPESCRIPT_CONFIG_NAME_RULES_DTS,
	TYPESCRIPT_CONFIG_NAME_RULES_IMPORTS,
	TYPESCRIPT_CONFIG_NAME_RULES_TYPEAWARE,
	TYPESCRIPT_CONFIG_NAME_SETUP,
	TYPESCRIPT_CONFIG_NAME_SETUP_IMPORTS,
} from './typescript.config-name';
import { DTS_GLOBS, TYPESCRIPT_GLOBS } from './typescript.globs';
import typescriptParser from './typescript.parser';

export default async function typescript(options: HexatoolEslintOptions): Promise<TypedFlatConfigItem[]> {
	const { imports, typescript } = options;
	if (typescript === false) {
		return [];
	}

	const [plugin, parser] = await Promise.all([
		interopDefault(import('@typescript-eslint/eslint-plugin')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	const importXPlugin = 'import-x';
	const importXPluginRename = PLUGIN_RENAME[importXPlugin];
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
				files: SOURCE_GLOBS,
				ignores: TYPESCRIPT_GLOBS,
				parser,
			}),
			typescriptParser({
				files: TYPESCRIPT_GLOBS,
				parser,
				tsconfigPath: toArray(typescript),
			})
		);
	}

	if (imports) {
		const typeScriptExtensions = ['.ts', '.tsx'] as const;
		const allExtensions = [...typeScriptExtensions, '.js', '.jsx'] as const;
		config.push({
			files: TYPESCRIPT_GLOBS,
			name: TYPESCRIPT_CONFIG_NAME_SETUP_IMPORTS,
			settings: {
				[`${importXPlugin}/extensions`]: typeScriptExtensions,
				[`${importXPlugin}/external-module-folders`]: ['node_modules', 'node_modules/@types'],
				[`${importXPlugin}/parsers`]: {
					'@typescript-eslint/parser': [...typeScriptExtensions, '.cts', '.mts'],
				},
				[`${importXPlugin}/resolver`]: {
					node: {
						extensions: allExtensions,
					},
					typescript: true,
				},
			},
		});
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

	if (imports) {
		config.push({
			files: TYPESCRIPT_GLOBS,
			name: TYPESCRIPT_CONFIG_NAME_RULES_IMPORTS,
			rules: {
				[`${importXPluginRename}/named`]: 'off',
			},
		});
	}

	return config;
}
