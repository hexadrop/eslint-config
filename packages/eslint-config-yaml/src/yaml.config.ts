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

	const yamlPluginName = PLUGIN_RENAME.yml;
	const yamlFiles = [...GLOB_YAML, ...GLOB_MARKDOWN_YAML];

	return [
		{
			name: YAML_CONFIG_NAME_SETUP,
			plugins: {
				[yamlPluginName]: pluginYaml,
			},
		},
		{
			files: yamlFiles,
			/*
			 * v3 ships an ESLint language plugin instead of a bare parser. The
			 * language id is `yaml` inside the plugin namespace, so the renamed
			 * `yaml` prefix resolves `yaml/yaml`.
			 */
			language: `${yamlPluginName}/yaml`,
			name: YAML_CONFIG_NAME_SETUP_LANGUAGE,
		},
		{
			files: yamlFiles,
			name: YAML_CONFIG_NAME_RULES,
			rules: renameRules(
				{
					/*
					 * The preset's base block also turns off three core rules that
					 * would otherwise run on YAML (`no-irregular-whitespace`,
					 * `no-unused-vars` and `spaced-comment`); they are kept on
					 * purpose.
					 */
					...collectRules(pluginYaml.configs.standard),
					[`${yamlPluginName}/indent`]: ['error', 2],
					[`${yamlPluginName}/quotes`]: ['error', { avoidEscape: false, prefer: 'single' }],
					/*
					 * Key order is meaningful in some YAML (GitHub Actions, CI
					 * pipelines), so it is never enforced.
					 */
					[`${yamlPluginName}/sort-keys`]: 'off',
				},
				PLUGIN_RENAME
			),
		},
	];
}
