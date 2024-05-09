import { ESLint, Linter } from 'eslint';

import type { RuleOptions } from '../typegen';
import renameRules from './rename-rules';

export default function pluginConfigRules(
	plugin: ESLint.Plugin,
	configName: string,
	map: Record<string, string> = {}
): Linter.RulesRecord & RuleOptions {
	let rules = {};
	if (plugin.configs && configName in plugin.configs) {
		const config = plugin.configs[configName];
		if (config && 'rules' in config && config.rules) {
			rules = config.rules as Linter.RulesRecord & RuleOptions;
		}
	}

	return renameRules(rules, map);
}
