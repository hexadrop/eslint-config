import { isPackageExists } from 'local-pkg';

import { PLUGIN_RENAME, PLUGIN_RENAME_TYPESCRIPT } from '../../const';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault, pluginConfigOverrideRules, toArray } from '../../utils';
import pluginConfigRules from '../../utils/plugin-config-rules';
import { SOURCE_GLOBS } from '../core';
import TYPESCRIPT_GLOBS from './typescript.globs';
import type { TypescriptOptions } from './typescript.options';
import typescriptParser from './typescript.parser';
import getCwdTsconfigPath from './typescript.tsconfig';

const TYPESCRIPT_CONFIG_NAME = 'hexatool/typescript';

export default async function typescript(
	options: TypescriptOptions = isPackageExists('typescript')
): Promise<TypedFlatConfigItem[]> {
	if (options === false) {
		return [];
	}

	const { stylistic = true, tsconfig = getCwdTsconfigPath() } = typeof options === 'object' ? options : {};

	const [plugin, parser] = await Promise.all([
		interopDefault(import('@typescript-eslint/eslint-plugin')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	const config: TypedFlatConfigItem[] = [];
	const typescriptPluginRename = PLUGIN_RENAME['@typescript-eslint'];
	const isTypeAware = Boolean(tsconfig && tsconfig.length > 0);

	// Install the plugins without globs, so they can be configured separately.
	config.push({
		name: `${TYPESCRIPT_CONFIG_NAME}/setup`,
		plugins: {
			typescript: plugin,
		},
	});

	if (tsconfig && tsconfig.length > 0) {
		config.push(
			typescriptParser({
				files: SOURCE_GLOBS,
				ignores: TYPESCRIPT_GLOBS,
				parser,
			}),
			typescriptParser({
				files: TYPESCRIPT_GLOBS,
				parser,
				tsconfigPath: toArray(tsconfig),
			})
		);
	} else {
		config.push(
			typescriptParser({
				files: SOURCE_GLOBS,
				parser,
			})
		);
	}

	config.push({
		files: SOURCE_GLOBS,
		name: `${TYPESCRIPT_CONFIG_NAME}/rules`,
		rules: {
			...pluginConfigOverrideRules(plugin, 'eslint-recommended', PLUGIN_RENAME_TYPESCRIPT),
			...pluginConfigRules(plugin, 'strict', PLUGIN_RENAME_TYPESCRIPT),
			[`${typescriptPluginRename}/explicit-module-boundary-types`]: ['error'],
			[`${typescriptPluginRename}/no-extraneous-class`]: 'off',
			// Disable the following rules, as they are covered by the eslint-plugin-unused-imports
			[`${typescriptPluginRename}/no-unused-vars`]: 'off',
		},
	});

	if (stylistic) {
		config.push({
			files: SOURCE_GLOBS,
			name: `${TYPESCRIPT_CONFIG_NAME}/rules/stylistic`,
			rules: {
				...pluginConfigRules(plugin, 'stylistic', PLUGIN_RENAME_TYPESCRIPT),
				[`${typescriptPluginRename}/member-ordering`]: [
					'error',
					{
						default: {
							memberTypes: [
								// Index signature
								'signature',
								'call-signature',

								// Fields
								'public-static-field',
								'protected-static-field',
								'private-static-field',
								'#private-static-field',

								'public-decorated-field',
								'protected-decorated-field',
								'private-decorated-field',

								'public-instance-field',
								'protected-instance-field',
								'private-instance-field',
								'#private-instance-field',

								'public-abstract-field',
								'protected-abstract-field',

								'public-field',
								'protected-field',
								'private-field',
								'#private-field',

								'static-field',
								'instance-field',
								'abstract-field',

								'decorated-field',

								'field',

								// Static initialization
								'static-initialization',

								// Constructors
								'public-constructor',
								'protected-constructor',
								'private-constructor',

								'constructor',

								// Getters
								'public-static-get',
								'protected-static-get',
								'private-static-get',
								'#private-static-get',

								'public-decorated-get',
								'protected-decorated-get',
								'private-decorated-get',

								'public-instance-get',
								'protected-instance-get',
								'private-instance-get',
								'#private-instance-get',

								'public-abstract-get',
								'protected-abstract-get',

								'public-get',
								'protected-get',
								'private-get',
								'#private-get',

								'static-get',
								'instance-get',
								'abstract-get',

								'decorated-get',

								'get',

								// Setters
								'public-static-set',
								'protected-static-set',
								'private-static-set',
								'#private-static-set',

								'public-decorated-set',
								'protected-decorated-set',
								'private-decorated-set',

								'public-instance-set',
								'protected-instance-set',
								'private-instance-set',
								'#private-instance-set',

								'public-abstract-set',
								'protected-abstract-set',

								'public-set',
								'protected-set',
								'private-set',
								'#private-set',

								'static-set',
								'instance-set',
								'abstract-set',

								'decorated-set',

								'set',

								// Methods
								'public-static-method',
								'protected-static-method',
								'private-static-method',
								'#private-static-method',

								'public-decorated-method',
								'protected-decorated-method',
								'private-decorated-method',

								'public-instance-method',
								'protected-instance-method',
								'private-instance-method',
								'#private-instance-method',

								'public-abstract-method',
								'protected-abstract-method',

								'public-method',
								'protected-method',
								'private-method',
								'#private-method',

								'static-method',
								'instance-method',
								'abstract-method',

								'decorated-method',

								'method',
							],
							order: 'alphabetically-case-insensitive',
						},
					},
				],
			},
		});
	}

	if (isTypeAware) {
		config.push({
			files: TYPESCRIPT_GLOBS,
			name: `${TYPESCRIPT_CONFIG_NAME}/rules/type-aware`,
			rules: {
				...pluginConfigRules(plugin, 'strict-type-checked-only', PLUGIN_RENAME_TYPESCRIPT),
				[`${typescriptPluginRename}/no-confusing-void-expression`]: ['error', { ignoreArrowShorthand: true }],
				[`${typescriptPluginRename}/no-unused-vars`]: 'off',
				[`${typescriptPluginRename}/prefer-readonly`]: ['error'],
				[`${typescriptPluginRename}/promise-function-async`]: ['error', { checkArrowFunctions: false }],
				[`${typescriptPluginRename}/switch-exhaustiveness-check`]: ['error'],
			},
		});
		if (stylistic) {
			config.push({
				files: TYPESCRIPT_GLOBS,
				name: `${TYPESCRIPT_CONFIG_NAME}/rules/type-aware/stylistic`,
				rules: {
					...pluginConfigRules(plugin, 'stylistic-type-checked-only', PLUGIN_RENAME_TYPESCRIPT),
				},
			});
		}
	}

	config.push({
		files: ['**/*.d.ts'],
		name: `${TYPESCRIPT_CONFIG_NAME}/rules/dts`,
		rules: {
			[`${typescriptPluginRename}/triple-slash-reference`]: 'off',
			'multiline-comment-style': 'off',
		},
	});

	return config;
}
