import {
	DTS_GLOBS,
	GLOB_MARKDOWN_SOURCE,
	interopDefault,
	JAVASCRIPT_GLOBS,
	PLUGIN_RENAME_TYPESCRIPT,
	pluginConfigOverrideRules,
	pluginConfigRules,
	SOURCE_GLOBS,
	TEST_GLOBS,
	toArray,
	TYPESCRIPT_CONFIG_NAME_RULES,
	TYPESCRIPT_CONFIG_NAME_RULES_DTS,
	TYPESCRIPT_CONFIG_NAME_RULES_TEST,
	TYPESCRIPT_CONFIG_NAME_RULES_TYPEAWARE,
	TYPESCRIPT_CONFIG_NAME_SETUP,
	TYPESCRIPT_GLOBS,
} from '@hexadrop/eslint-config-shared';

import typescriptParser from './typescript.parser';
import type { TypedFlatConfigItem } from './typescript.typed-config';

export interface TypescriptFactoryOptions {
	/**
	 * If true, enables TS support without type-aware linting.
	 *  If a string or array, enables type-aware linting with those tsconfig paths.
	 *  If false/undefined, returns an empty config.
	 */
	project?: boolean | string | string[];
	/**
	 *Root directory for tsconfig resolution. Defaults to cwd().
	 */
	tsconfigRootDir?: string;
}

export default async function typescriptConfig(options: TypescriptFactoryOptions = {}): Promise<TypedFlatConfigItem[]> {
	const { project, tsconfigRootDir } = options;
	if (!project) {
		return [];
	}

	const [plugin, parser] = await Promise.all([
		interopDefault(import('@typescript-eslint/eslint-plugin')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	const typescriptPluginRename = PLUGIN_RENAME_TYPESCRIPT['@typescript-eslint'];

	const config: TypedFlatConfigItem[] = [];
	const isTypeAware = typeof project !== 'boolean';

	config.push({
		name: TYPESCRIPT_CONFIG_NAME_SETUP,
		plugins: {
			typescript: plugin,
		},
	});

	if (project === true) {
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
				tsconfigPath: toArray(project),
				...(tsconfigRootDir && { tsconfigRootDir }),
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
				[`${typescriptPluginRename}/no-unused-vars`]: 'off',
			},
		},
		{
			files: DTS_GLOBS,
			name: TYPESCRIPT_CONFIG_NAME_RULES_DTS,
			rules: {
				[`${typescriptPluginRename}/triple-slash-reference`]: 'off',
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
				[`${typescriptPluginRename}/no-deprecated`]: 'warn',
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
