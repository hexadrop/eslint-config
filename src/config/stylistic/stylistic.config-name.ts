import { PLUGIN_PREFIX } from '../../const';

const STYLISTIC_CONFIG_NAME = `${PLUGIN_PREFIX}/stylistic` as const;
const STYLISTIC_CONFIG_NAME_SETUP = `${STYLISTIC_CONFIG_NAME}/setup` as const;
const STYLISTIC_CONFIG_NAME_RULES = `${STYLISTIC_CONFIG_NAME}/rules` as const;
const STYLISTIC_CONFIG_NAME_RULES_UNICORN = `${STYLISTIC_CONFIG_NAME_RULES}/unicorn` as const;
const STYLISTIC_CONFIG_NAME_RULES_UNICORN_MARKDOWN = `${STYLISTIC_CONFIG_NAME_RULES_UNICORN}/markdown` as const;
const STYLISTIC_CONFIG_NAME_RULES_UNICORN_MARKDOWN_SOURCE =
	`${STYLISTIC_CONFIG_NAME_RULES_UNICORN_MARKDOWN}/source` as const;
const STYLISTIC_CONFIG_NAME_RULES_PERFECTIONIST = `${STYLISTIC_CONFIG_NAME_RULES}/perfectionist` as const;
const STYLISTIC_CONFIG_NAME_RULES_MARKDOWN = `${STYLISTIC_CONFIG_NAME_RULES}/markdown` as const;
const STYLISTIC_CONFIG_NAME_RULES_MARKDOWN_SOURCE = `${STYLISTIC_CONFIG_NAME_RULES_MARKDOWN}/source` as const;
const STYLISTIC_CONFIG_NAME_RULES_ASTRO = `${STYLISTIC_CONFIG_NAME_RULES}/astro` as const;
const STYLISTIC_CONFIG_NAME_RULES_JSON = `${STYLISTIC_CONFIG_NAME_RULES}/json` as const;
const STYLISTIC_CONFIG_NAME_RULES_JSON_PACKAGE = `${STYLISTIC_CONFIG_NAME_RULES_JSON}/package.json` as const;
const STYLISTIC_CONFIG_NAME_RULES_JSON_TSCONFIG = `${STYLISTIC_CONFIG_NAME_RULES_JSON}/tsconfig.json` as const;
const STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT = `${STYLISTIC_CONFIG_NAME_RULES}/typescript` as const;
const STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT_DTS = `${STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT}/dts` as const;
const STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT_TYPE_AWARE =
	`${STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT}/type-aware` as const;
const STYLISTIC_CONFIG_NAME_RULES_PRETTIER = `${STYLISTIC_CONFIG_NAME_RULES}/prettier` as const;
const STYLISTIC_CONFIG_NAME_RULES_PRETTIER_ASTRO = `${STYLISTIC_CONFIG_NAME_RULES_PRETTIER}/astro` as const;
const STYLISTIC_CONFIG_NAME_RULES_PRETTIER_JSON = `${STYLISTIC_CONFIG_NAME_RULES_PRETTIER}/json` as const;
const STYLISTIC_CONFIG_NAME_RULES_PRETTIER_MARKDOWN = `${STYLISTIC_CONFIG_NAME_RULES_PRETTIER}/markdown` as const;
const STYLISTIC_CONFIG_NAME_RULES_PRETTIER_MARKDOWN_SOURCE =
	`${STYLISTIC_CONFIG_NAME_RULES_PRETTIER_MARKDOWN}/source` as const;

type StylisticConfigNames =
	| typeof STYLISTIC_CONFIG_NAME_RULES
	| typeof STYLISTIC_CONFIG_NAME_RULES_ASTRO
	| typeof STYLISTIC_CONFIG_NAME_RULES_JSON
	| typeof STYLISTIC_CONFIG_NAME_RULES_JSON_PACKAGE
	| typeof STYLISTIC_CONFIG_NAME_RULES_JSON_TSCONFIG
	| typeof STYLISTIC_CONFIG_NAME_RULES_MARKDOWN
	| typeof STYLISTIC_CONFIG_NAME_RULES_MARKDOWN_SOURCE
	| typeof STYLISTIC_CONFIG_NAME_RULES_PERFECTIONIST
	| typeof STYLISTIC_CONFIG_NAME_RULES_PRETTIER
	| typeof STYLISTIC_CONFIG_NAME_RULES_PRETTIER_ASTRO
	| typeof STYLISTIC_CONFIG_NAME_RULES_PRETTIER_JSON
	| typeof STYLISTIC_CONFIG_NAME_RULES_PRETTIER_MARKDOWN_SOURCE
	| typeof STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT_DTS
	| typeof STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT_TYPE_AWARE
	| typeof STYLISTIC_CONFIG_NAME_RULES_UNICORN
	| typeof STYLISTIC_CONFIG_NAME_RULES_UNICORN_MARKDOWN
	| typeof STYLISTIC_CONFIG_NAME_RULES_UNICORN_MARKDOWN_SOURCE
	| typeof STYLISTIC_CONFIG_NAME_SETUP;

export type { StylisticConfigNames };

export {
	STYLISTIC_CONFIG_NAME_RULES,
	STYLISTIC_CONFIG_NAME_RULES_ASTRO,
	STYLISTIC_CONFIG_NAME_RULES_JSON,
	STYLISTIC_CONFIG_NAME_RULES_JSON_PACKAGE,
	STYLISTIC_CONFIG_NAME_RULES_JSON_TSCONFIG,
	STYLISTIC_CONFIG_NAME_RULES_MARKDOWN,
	STYLISTIC_CONFIG_NAME_RULES_MARKDOWN_SOURCE,
	STYLISTIC_CONFIG_NAME_RULES_PERFECTIONIST,
	STYLISTIC_CONFIG_NAME_RULES_PRETTIER,
	STYLISTIC_CONFIG_NAME_RULES_PRETTIER_ASTRO,
	STYLISTIC_CONFIG_NAME_RULES_PRETTIER_JSON,
	STYLISTIC_CONFIG_NAME_RULES_PRETTIER_MARKDOWN_SOURCE,
	STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT,
	STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT_DTS,
	STYLISTIC_CONFIG_NAME_RULES_TYPESCRIPT_TYPE_AWARE,
	STYLISTIC_CONFIG_NAME_RULES_UNICORN,
	STYLISTIC_CONFIG_NAME_RULES_UNICORN_MARKDOWN,
	STYLISTIC_CONFIG_NAME_RULES_UNICORN_MARKDOWN_SOURCE,
	STYLISTIC_CONFIG_NAME_SETUP,
};
