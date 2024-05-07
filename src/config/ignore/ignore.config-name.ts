import { PLUGIN_PREFIX } from '../../const';

const IGNORE_CONFIG_NAME = `${PLUGIN_PREFIX}/ignore` as const;
const IGNORE_CONFIG_NAME_ADDITIONAL = `${IGNORE_CONFIG_NAME}/additional` as const;
const IGNORE_CONFIG_NAME_GITIGNORE = `${IGNORE_CONFIG_NAME}/gitignore` as const;

type IgnoreConfigNames =
	| typeof IGNORE_CONFIG_NAME
	| typeof IGNORE_CONFIG_NAME_ADDITIONAL
	| typeof IGNORE_CONFIG_NAME_GITIGNORE;

export type { IgnoreConfigNames };

export { IGNORE_CONFIG_NAME, IGNORE_CONFIG_NAME_ADDITIONAL, IGNORE_CONFIG_NAME_GITIGNORE };
