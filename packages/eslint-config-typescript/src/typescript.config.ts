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
import type { ParserOptions } from '@typescript-eslint/parser';

import typescriptParser, { isTypeAware } from './typescript.parser';
import type { TypedFlatConfigItem } from './typescript.typed-config';

export interface TypescriptFactoryOptions {
	/**
	 * Extra parser options merged into the TypeScript parser config, after the
	 * internal `project`/`tsconfigRootDir`. Use `projectService` to let
	 * typescript-eslint resolve the project for every file (solution-style
	 * tsconfigs and workspaces); `project` is then optional and omitted from the
	 * parser options to avoid mixing both resolution modes.
	 */
	parserOptions?: Partial<ParserOptions>;
	/**
	 * If true, enables TS support without type-aware linting.
	 * If a string or array, enables type-aware linting with those tsconfig paths.
	 * If false/undefined, returns an empty config.
	 */
	project?: boolean | string | string[];
	/**
	 * Root directory for tsconfig resolution. Defaults to cwd().
	 */
	tsconfigRootDir?: string;
}

export default async function typescriptConfig(options: TypescriptFactoryOptions = {}): Promise<TypedFlatConfigItem[]> {
	const { parserOptions, project, tsconfigRootDir } = options;
	const hasProjectService = Boolean(parserOptions?.projectService);
	if (project === false || (!project && !hasProjectService)) {
		return [];
	}

	const [plugin, parser] = await Promise.all([
		interopDefault(import('@typescript-eslint/eslint-plugin')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	const typescriptPluginRename = PLUGIN_RENAME_TYPESCRIPT['@typescript-eslint'];

	const config: TypedFlatConfigItem[] = [];
	const tsconfigPath = project && project !== true ? toArray(project) : undefined;
	const isTypeAwareLinting = isTypeAware(tsconfigPath, parserOptions);

	config.push({
		name: TYPESCRIPT_CONFIG_NAME_SETUP,
		plugins: {
			typescript: plugin,
		},
	});

	if (project === true && !hasProjectService) {
		config.push(
			typescriptParser({
				files: SOURCE_GLOBS,
				parser,
				...(parserOptions && { parserOptions }),
				...(tsconfigRootDir && { tsconfigRootDir }),
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
				...(parserOptions && { parserOptions }),
				...(tsconfigPath && !hasProjectService && { tsconfigPath }),
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

	if (isTypeAwareLinting) {
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
