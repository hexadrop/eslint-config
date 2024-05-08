import { PLUGIN_PREFIX } from '../../const';

const JSON_CONFIG_NAME = `${PLUGIN_PREFIX}/json` as const;
const JSON_CONFIG_NAME_SETUP = `${JSON_CONFIG_NAME}/setup` as const;
const JSON_CONFIG_NAME_SETUP_PARSER = `${JSON_CONFIG_NAME_SETUP}/parser` as const;
const JSON_CONFIG_NAME_RULES = `${JSON_CONFIG_NAME}/rules` as const;

type JsonConfigNames =
	| typeof JSON_CONFIG_NAME_RULES
	| typeof JSON_CONFIG_NAME_SETUP
	| typeof JSON_CONFIG_NAME_SETUP_PARSER;

export type { JsonConfigNames };

export { JSON_CONFIG_NAME_RULES, JSON_CONFIG_NAME_SETUP, JSON_CONFIG_NAME_SETUP_PARSER };
