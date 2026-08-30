import { ESLint, Linter } from 'eslint';

import renameRules from './rename-rules';

export default function pluginConfigRules(
	plugin: ESLint.Plugin,
	configName: string,
	map: Record<string, string> = {}
): Linter.RulesRecord {
	let rules = {};
	if (plugin.configs && Object.hasOwn(plugin.configs, configName)) {
		const config = plugin.configs[configName];
		if (config && 'rules' in config && config.rules) {
			rules = config.rules;
		}
	}

	return renameRules(rules, map);
}
