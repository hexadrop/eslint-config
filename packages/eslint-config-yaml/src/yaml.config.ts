import {
	GLOB_MARKDOWN_YAML,
	GLOB_YAML,
	interopDefault,
	PLUGIN_RENAME,
	renameRules,
	YAML_CONFIG_NAME_RULES,
	YAML_CONFIG_NAME_SETUP,
	YAML_CONFIG_NAME_SETUP_LANGUAGE,
} from '@hexadrop/eslint-config-shared';
import type { Linter } from 'eslint';

import type { TypedFlatConfigItem } from './yaml.typed-config';

/**
 * Merge every rule block from a plugin's flat config array.
 *
 * `pluginConfigRules` reads a single `config.rules` object, but
 * `eslint-plugin-yml` v3 exposes its presets as flat config arrays.
 */
function collectRules(configs: Linter.Config[]): Linter.RulesRecord {
	const rules: Linter.RulesRecord = {};

	for (const config of configs) {
		if (config.rules) {
			Object.assign(rules, config.rules);
		}
	}

	return rules;
}

export default async function yamlConfig(): Promise<TypedFlatConfigItem[]> {
	const pluginYaml = await interopDefault(import('eslint-plugin-yml'));

	const yamlPluginRename = PLUGIN_RENAME.yml;

	return [
		{
			name: YAML_CONFIG_NAME_SETUP,
			plugins: {
				[yamlPluginRename]: pluginYaml,
			},
		},
		{
			files: [...GLOB_YAML, ...GLOB_MARKDOWN_YAML],
			/*
			 * v3 ships an ESLint language plugin instead of a bare parser. The
			 * language id is `yaml` inside the plugin namespace, so the renamed
			 * `yaml` prefix resolves `yaml/yaml`.
			 */
			language: `${yamlPluginRename}/yaml`,
			name: YAML_CONFIG_NAME_SETUP_LANGUAGE,
		},
		{
			files: [...GLOB_YAML, ...GLOB_MARKDOWN_YAML],
			name: YAML_CONFIG_NAME_RULES,
			rules: renameRules(
				{
					...collectRules(pluginYaml.configs.standard),
					[`${yamlPluginRename}/indent`]: ['error', 2],
					[`${yamlPluginRename}/quotes`]: ['error', { avoidEscape: false, prefer: 'single' }],
					/*
					 * Key order is meaningful in some YAML (GitHub Actions, CI
					 * pipelines), so it is never enforced.
					 */
					[`${yamlPluginRename}/sort-keys`]: 'off',
				},
				PLUGIN_RENAME
			),
		},
	];
}
