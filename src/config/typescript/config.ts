import type { ParserOptions } from '@typescript-eslint/parser';
import type { ClassicConfig } from '@typescript-eslint/utils/ts-eslint';
import { isPackageExists } from 'local-pkg';
import process from 'node:process';
import { GLOB_SRC } from '../../globs';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault, renameRules, toArray } from '../../utils';
import GLOB_TYPESCRIPT from './globs';
import type { TypescriptOptions } from './options';

interface MakeParserOptions {
	componentExtensions: string[];
	files: string[];
	ignores?: string[];
	parserOptions?: Partial<ParserOptions>;
	tsconfigPath?: string[] | undefined;
	typeAware: boolean;
}

type TypescriptParser = typeof import('@typescript-eslint/parser');
type TypescriptPlugin = typeof import('@typescript-eslint/eslint-plugin');
type ConfigOverride = Required<ClassicConfig.Config>['overrides'][number];

function makeParser(parser: TypescriptParser, {
	componentExtensions,
	tsconfigPath,
	files,
	ignores,
	typeAware,
	parserOptions,
}: MakeParserOptions): TypedFlatConfigItem {
	return {
		files,
		...ignores ? { ignores } : {},
		languageOptions: {
			parser,
			parserOptions: {
				extraFileExtensions: componentExtensions.map(ext => `.${ext}`),
				sourceType: 'module',
				...typeAware
					? {
						project: tsconfigPath,
						tsconfigRootDir: process.cwd(),
					}
					: {},
				...parserOptions as any,
			},
		},
		name: `hexatool/typescript/${typeAware ? 'type-aware-parser' : 'parser'}`,
	};
}

function getConfig(plugin: TypescriptPlugin, name: string): ClassicConfig.Config | undefined {
	const configs = plugin.configs;

	return configs[name];
}

function getOverrides(plugin: TypescriptPlugin, name: string): ConfigOverride[];
function getOverrides(plugin: TypescriptPlugin, name: string, index: number): ConfigOverride | undefined;
function getOverrides(plugin: TypescriptPlugin, name: string, index?: number): ConfigOverride[] | ConfigOverride | undefined {
	const config = getConfig(plugin, name);
	const overrides = config?.overrides ?? [];

	return index === undefined ? overrides : overrides[index];
}

const RENAME_RULES_MAP = { '@typescript-eslint': 'typescript' };

export default async function typescript(
	typescriptOptions: TypescriptOptions['typescript'] = isPackageExists('typescript'),
	componentExtensions: string[] = [],
): Promise<TypedFlatConfigItem[]> {
	if (!typescriptOptions) {
		return [];
	}

	const optionsObject = typeof typescriptOptions === 'object' ? typescriptOptions : {};

	const tsconfigPath = 'tsconfigPath' in optionsObject && Boolean(optionsObject.tsconfigPath)
		? toArray(optionsObject.tsconfigPath)
		: undefined;
	const isTypeAware = Boolean(tsconfigPath);
	const files = [
		GLOB_SRC,
		...componentExtensions.map(ext => `**/*.${ext}`),
	];
	const filesTypeAware = 'filesTypeAware' in optionsObject && optionsObject.filesTypeAware ? optionsObject.filesTypeAware : GLOB_TYPESCRIPT;

	const [
		plugin,
		parser,
	] = await Promise.all([
		interopDefault(import('@typescript-eslint/eslint-plugin')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	const eslintRecommendedOverrides = getOverrides(plugin, 'eslint-recommended', 0);
	const eslintRecommendedOverridesRules = eslintRecommendedOverrides?.rules ?? {};
	const eslintStrictConfig = getConfig(plugin, 'strict');
	const eslintStrictConfigRules = eslintStrictConfig?.rules ?? {};
	const eslintStrictTypeCheckedConfig = getConfig(plugin, 'strict-type-checked');
	const eslintStrictTypeCheckedConfigRules = eslintStrictTypeCheckedConfig?.rules ?? {};

	const config: TypedFlatConfigItem[] = [{
		// Install the plugins without globs, so they can be configured separately.
		name: 'hexatool/typescript/setup',
		plugins: {
			typescript: plugin,
		},
	}];

	// Assign type-aware parser for type-aware files and type-unaware parser for the rest
	if (isTypeAware) {
		config.push(
			makeParser(parser, { componentExtensions, tsconfigPath, files: filesTypeAware, typeAware: true }),
			makeParser(parser, {
				componentExtensions,
				tsconfigPath,
				files,
				ignores: filesTypeAware,
				typeAware: false,
			}),
		);
	} else {
		config.push(makeParser(parser, { componentExtensions, files, typeAware: false }));
	}

	config.push(
		{
			files,
			name: 'hexatool/typescript/rules',
			rules: {
				...renameRules(
					eslintRecommendedOverridesRules,
					RENAME_RULES_MAP,
				),

				...renameRules(
					eslintStrictConfigRules,
					RENAME_RULES_MAP,
				),


				'typescript/explicit-module-boundary-types': ['error'],
				'typescript/member-ordering': [
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
				'typescript/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
				'typescript/no-require-imports': ['error'],
				'typescript/prefer-readonly': ['error'],
				'typescript/promise-function-async': ['error', { checkArrowFunctions: false }],
				'typescript/switch-exhaustiveness-check': ['error'],
				'typescript/no-extraneous-class': 'off',
				'typescript/no-unused-vars': 'off',

				...optionsObject.overrides,
			},
		},
	);

	if (isTypeAware) {
		config.push({
			files: filesTypeAware,
			name: 'hexatool/typescript/rules-type-aware',
			rules: {
				...renameRules(
					eslintStrictTypeCheckedConfigRules,
					RENAME_RULES_MAP,
				),
				'typescript/no-unused-vars': 'off',
				...optionsObject.overrides,
			},
		})
	}


	return config;
}
