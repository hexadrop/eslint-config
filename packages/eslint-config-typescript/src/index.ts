export { type HexadropEslintTypescriptOptions, default as typescript } from './typescript.config';
export type { TypescriptConfigNames } from './typescript.config-name';
export {
	TYPESCRIPT_CONFIG_NAME_RULES,
	TYPESCRIPT_CONFIG_NAME_RULES_DTS,
	TYPESCRIPT_CONFIG_NAME_RULES_TEST,
	TYPESCRIPT_CONFIG_NAME_RULES_TYPEAWARE,
	TYPESCRIPT_CONFIG_NAME_SETUP,
	TYPESCRIPT_CONFIG_NAME_SETUP_PARSER,
	TYPESCRIPT_CONFIG_NAME_SETUP_PARSER_TYPEAWARE,
} from './typescript.config-name';
export { default } from './typescript.factory';
export { DTS_GLOBS, JAVASCRIPT_GLOBS, SOURCE_GLOBS, TEST_GLOBS, TYPESCRIPT_GLOBS } from './typescript.globs';
export type { TypedFlatConfigItem } from './typescript.typed-config';
