import { PLUGIN_PREFIX } from '../../const';

const REACT_CONFIG_NAME = `${PLUGIN_PREFIX}/react` as const;
const REACT_CONFIG_NAME_SETUP = `${REACT_CONFIG_NAME}/setup` as const;
const REACT_CONFIG_NAME_RULES = `${REACT_CONFIG_NAME}/rules` as const;
const REACT_CONFIG_NAME_RULES_HOOKS = `${REACT_CONFIG_NAME_RULES}/hooks` as const;
const REACT_CONFIG_NAME_RULES_REFRESH = `${REACT_CONFIG_NAME_RULES}/refresh` as const;

type ReactConfigNames =
	| typeof REACT_CONFIG_NAME_RULES
	| typeof REACT_CONFIG_NAME_RULES_HOOKS
	| typeof REACT_CONFIG_NAME_RULES_REFRESH
	| typeof REACT_CONFIG_NAME_SETUP;

export type { ReactConfigNames };

export {
	REACT_CONFIG_NAME_RULES,
	REACT_CONFIG_NAME_RULES_HOOKS,
	REACT_CONFIG_NAME_RULES_REFRESH,
	REACT_CONFIG_NAME_SETUP,
};
