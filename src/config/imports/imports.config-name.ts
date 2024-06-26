import { PLUGIN_PREFIX } from '../../const';

const IMPORTS_CONFIG_NAME = `${PLUGIN_PREFIX}/imports` as const;
const IMPORTS_CONFIG_NAME_SETUP = `${IMPORTS_CONFIG_NAME}/setup` as const;
const IMPORTS_CONFIG_NAME_SETUP_TYPESCRIPT = `${IMPORTS_CONFIG_NAME_SETUP}/typescript` as const;
const IMPORTS_CONFIG_NAME_RULES = `${IMPORTS_CONFIG_NAME}/rules` as const;
const IMPORTS_CONFIG_NAME_RULES_WARNINGS = `${IMPORTS_CONFIG_NAME_RULES}/warnings` as const;
const IMPORTS_CONFIG_NAME_RULES_WARNINGS_ESLINT_CONFIG = `${IMPORTS_CONFIG_NAME_RULES_WARNINGS}/eslint-config` as const;
const IMPORTS_CONFIG_NAME_RULES_TYPESCRIPT = `${IMPORTS_CONFIG_NAME_RULES}/typescript` as const;
const IMPORTS_CONFIG_NAME_RULES_STATIC = `${IMPORTS_CONFIG_NAME_RULES}/static` as const;
const IMPORTS_CONFIG_NAME_RULES_STATIC_MARKDOWN_SOURCE = `${IMPORTS_CONFIG_NAME_RULES_STATIC}/markdown/source` as const;
const IMPORTS_CONFIG_NAME_RULES_STYLISTIC = `${IMPORTS_CONFIG_NAME_RULES}/stylistic` as const;
const IMPORTS_CONFIG_NAME_RULES_STYLISTIC_ASTRO = `${IMPORTS_CONFIG_NAME_RULES_STYLISTIC}/astro` as const;
const IMPORTS_CONFIG_NAME_RULES_STYLISTIC_TYPESCRIPT_DTS =
	`${IMPORTS_CONFIG_NAME_RULES_STYLISTIC}/typescript/dts` as const;
const IMPORTS_CONFIG_NAME_RULES_STYLISTIC_MARKDOWN_SOURCE =
	`${IMPORTS_CONFIG_NAME_RULES_STYLISTIC}/markdown/source` as const;

type ImportsConfigNames =
	| typeof IMPORTS_CONFIG_NAME_RULES_STATIC
	| typeof IMPORTS_CONFIG_NAME_RULES_STATIC_MARKDOWN_SOURCE
	| typeof IMPORTS_CONFIG_NAME_RULES_STYLISTIC
	| typeof IMPORTS_CONFIG_NAME_RULES_STYLISTIC_ASTRO
	| typeof IMPORTS_CONFIG_NAME_RULES_STYLISTIC_MARKDOWN_SOURCE
	| typeof IMPORTS_CONFIG_NAME_RULES_STYLISTIC_TYPESCRIPT_DTS
	| typeof IMPORTS_CONFIG_NAME_RULES_TYPESCRIPT
	| typeof IMPORTS_CONFIG_NAME_RULES_WARNINGS
	| typeof IMPORTS_CONFIG_NAME_RULES_WARNINGS_ESLINT_CONFIG
	| typeof IMPORTS_CONFIG_NAME_SETUP
	| typeof IMPORTS_CONFIG_NAME_SETUP_TYPESCRIPT;

export type { ImportsConfigNames };

export {
	IMPORTS_CONFIG_NAME_RULES_STATIC,
	IMPORTS_CONFIG_NAME_RULES_STATIC_MARKDOWN_SOURCE,
	IMPORTS_CONFIG_NAME_RULES_STYLISTIC,
	IMPORTS_CONFIG_NAME_RULES_STYLISTIC_ASTRO,
	IMPORTS_CONFIG_NAME_RULES_STYLISTIC_MARKDOWN_SOURCE,
	IMPORTS_CONFIG_NAME_RULES_STYLISTIC_TYPESCRIPT_DTS,
	IMPORTS_CONFIG_NAME_RULES_TYPESCRIPT,
	IMPORTS_CONFIG_NAME_RULES_WARNINGS,
	IMPORTS_CONFIG_NAME_RULES_WARNINGS_ESLINT_CONFIG,
	IMPORTS_CONFIG_NAME_SETUP,
	IMPORTS_CONFIG_NAME_SETUP_TYPESCRIPT,
};
