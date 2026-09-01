import {
	interopDefault,
	PLUGIN_RENAME_TYPESCRIPT,
	pluginConfigOverrideRules,
	pluginConfigRules,
	toArray,
} from '@hexadrop/eslint-config-shared';

import {
	TYPESCRIPT_CONFIG_NAME_RULES,
	TYPESCRIPT_CONFIG_NAME_RULES_DTS,
	TYPESCRIPT_CONFIG_NAME_RULES_TEST,
	TYPESCRIPT_CONFIG_NAME_RULES_TYPEAWARE,
	TYPESCRIPT_CONFIG_NAME_SETUP,
} from './typescript.config-name';
import { DTS_GLOBS, JAVASCRIPT_GLOBS, SOURCE_GLOBS, TEST_GLOBS, TYPESCRIPT_GLOBS } from './typescript.globs';
import typescriptParser from './typescript.parser';
import type { TypedFlatConfigItem } from './typescript.typed-config';

interface HexadropEslintTypescriptOptions {
	/**
	 * Root directory for tsconfig resolution.
	 * @default cwd()
	 */
	tsconfigRootDir?: string;
	/**
	 * @default true
	 */
	typescript?: boolean | string | string[];
}

async function typescript(options: HexadropEslintTypescriptOptions = {}): Promise<TypedFlatConfigItem[]> {
	const { tsconfigRootDir, typescript: tsOption = true } = options;
	if (!tsOption) {
		return [];
	}

	const [plugin, parser] = await Promise.all([
		interopDefault(import('@typescript-eslint/eslint-plugin')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	const config: TypedFlatConfigItem[] = [
		{
			name: TYPESCRIPT_CONFIG_NAME_SETUP,
			plugins: {
				typescript: plugin,
			},
		},
	];

	// Install the parser. Boolean true = non-type-aware; string/array = type-aware.
	if (tsOption === true) {
		config.push(
			typescriptParser({
				files: SOURCE_GLOBS,
				parser,
				...(tsconfigRootDir && { tsconfigRootDir }),
			})
		);
	} else {
		config.push(
			typescriptParser({
				files: JAVASCRIPT_GLOBS,
				parser,
				...(tsconfigRootDir && { tsconfigRootDir }),
			}),
			typescriptParser({
				files: TYPESCRIPT_GLOBS,
				parser,
				tsconfigPath: toArray(tsOption),
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
				'typescript/explicit-module-boundary-types': ['error'],
				'typescript/no-extraneous-class': 'off',
				// Disable the following rules, as they are covered by the eslint-plugin-unused-imports
				'typescript/no-unused-vars': 'off',
			},
		},
		{
			files: DTS_GLOBS,
			name: TYPESCRIPT_CONFIG_NAME_RULES_DTS,
			rules: {
				'typescript/triple-slash-reference': 'off',
			},
		}
	);

	if (tsOption !== true) {
		config.push({
			files: TYPESCRIPT_GLOBS,
			name: TYPESCRIPT_CONFIG_NAME_RULES_TYPEAWARE,
			rules: {
				...pluginConfigRules(plugin, 'strict-type-checked-only', PLUGIN_RENAME_TYPESCRIPT),
				'typescript/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
				'typescript/no-deprecated': 'warn',
				'typescript/no-unused-vars': 'off',
				'typescript/prefer-readonly': ['error'],
				'typescript/promise-function-async': ['error', { checkArrowFunctions: false }],
				'typescript/switch-exhaustiveness-check': ['error'],
			},
		});
	}

	config.push({
		files: TEST_GLOBS,
		name: TYPESCRIPT_CONFIG_NAME_RULES_TEST,
		rules: {
			'typescript/no-confusing-void-expression': 'off',
		},
	});

	return config;
}

export type { HexadropEslintTypescriptOptions };

export default typescript;
