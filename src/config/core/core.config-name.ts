import { PLUGIN_PREFIX } from '../../const';

const CORE_CONFIG_NAME = `${PLUGIN_PREFIX}/core` as const;
const CORE_CONFIG_NAME_SETUP = `${CORE_CONFIG_NAME}/setup` as const;
const CORE_CONFIG_NAME_RULES = `${CORE_CONFIG_NAME}/rules` as const;
const CORE_CONFIG_NAME_RULES_MARKDOWN_SOURCE = `${CORE_CONFIG_NAME_RULES}/markdown/source` as const;
const CORE_CONFIG_NAME_RULES_NODE = `${CORE_CONFIG_NAME_RULES}/node` as const;

type CoreConfigNames =
	| typeof CORE_CONFIG_NAME_RULES
	| typeof CORE_CONFIG_NAME_RULES_MARKDOWN_SOURCE
	| typeof CORE_CONFIG_NAME_RULES_NODE
	| typeof CORE_CONFIG_NAME_SETUP;

export type { CoreConfigNames };

export {
	CORE_CONFIG_NAME_RULES,
	CORE_CONFIG_NAME_RULES_MARKDOWN_SOURCE,
	CORE_CONFIG_NAME_RULES_NODE,
	CORE_CONFIG_NAME_SETUP,
};
