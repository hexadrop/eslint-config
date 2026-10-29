import { DTS_GLOBS, GLOB_MARKDOWN_SOURCE, SOURCE_GLOBS, TYPESCRIPT_GLOBS } from '@hexadrop/eslint-config-core';
import {
	interopDefault,
	PLUGIN_RENAME,
	PLUGIN_RENAME_TYPESCRIPT,
	pluginConfigRules,
	STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT,
	STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT_DTS,
	STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT_TYPE_AWARE,
} from '@hexadrop/eslint-config-shared';

import type { StylisticConfigOptions } from '../stylistic.options';
import type { TypedFlatConfigItem } from '../stylistic.typed-config';

export default async function typescriptAdapter(options: StylisticConfigOptions): Promise<TypedFlatConfigItem[]> {
	const { isTypeAware = false } = options;
	const typescriptPluginRename = PLUGIN_RENAME['@typescript-eslint'];
	const stylisticPluginRename = PLUGIN_RENAME['@stylistic'];

	const plugin = await interopDefault(import('@typescript-eslint/eslint-plugin'));

	const config: TypedFlatConfigItem[] = [
		{
			files: SOURCE_GLOBS,
			name: STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT,
			rules: {
				...pluginConfigRules(plugin, 'stylistic', PLUGIN_RENAME_TYPESCRIPT),
				[`${typescriptPluginRename}/consistent-type-assertions`]: 'off',
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
							order: 'natural',
						},
					},
				],
			},
		},
	];

	if (isTypeAware) {
		config.push({
			files: TYPESCRIPT_GLOBS,
			ignores: GLOB_MARKDOWN_SOURCE,
			name: STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT_TYPE_AWARE,
			rules: {
				...pluginConfigRules(plugin, 'stylistic-type-checked-only', PLUGIN_RENAME_TYPESCRIPT),
				// Requires tsconfig.json, so it only runs in the type-aware pass.
				[`${typescriptPluginRename}/consistent-type-assertions`]: 'error',
			},
		});
	}

	config.push({
		files: DTS_GLOBS,
		name: STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT_DTS,
		rules: {
			[`${stylisticPluginRename}/multiline-comment-style`]: 'off',
			[`${stylisticPluginRename}/spaced-comment`]: 'off',
		},
	});

	return config;
}
