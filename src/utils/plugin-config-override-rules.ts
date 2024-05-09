import { ESLint, Linter } from 'eslint';

import type { RuleOptions } from '../typegen';
import renameRules from './rename-rules';

function pluginConfigOverrideRules(
	plugin: ESLint.Plugin,
	configName: string,
	indexOrMap?: Record<string, string> | number
): Linter.RulesRecord & RuleOptions;
function pluginConfigOverrideRules(
	plugin: ESLint.Plugin,
	configName: string,
	indexOrMap: number,
	map: Record<string, string>
): Linter.RulesRecord & RuleOptions;
function pluginConfigOverrideRules(
	plugin: ESLint.Plugin,
	configName: string,
	indexOrMap?: Record<string, string> | number,
	map2?: Record<string, string>
): Linter.RulesRecord & RuleOptions {
	let index = 0;
	let map: Record<string, string> = {};
	if (typeof indexOrMap === 'number') {
		index = indexOrMap;
	}
	if (typeof indexOrMap === 'object') {
		map = indexOrMap;
	} else if (typeof map2 === 'object') {
		map = map2;
	}

	let rules = {};
	if (plugin.configs && configName in plugin.configs) {
		const config = plugin.configs[configName];
		if (config && 'overrides' in config) {
			const overrides = config.overrides;

			const indexOverride = overrides ? overrides[index] : undefined;
			if (indexOverride?.rules) {
				rules = indexOverride.rules as Linter.RulesRecord & RuleOptions;
			}
		}
	}

	return renameRules(rules, map);
}

export default pluginConfigOverrideRules;
