import {
	GLOB_ASTRO,
	GLOB_MARKDOWN_ASTRO,
	PLUGIN_RENAME,
	STYLISTIC_CONFIG_NAME_RULES_ASTRO,
	STYLISTIC_CONFIG_NAME_RULES_MARKDOWN_ASTRO,
} from '@hexadrop/eslint-config-shared';

import type { TypedFlatConfigItem } from '../stylistic.typed-config';

/**
 * Astro concern: the astro-specific stylistic rules.
 */
export default function astroAdapter(): TypedFlatConfigItem[] {
	return [
		{
			files: GLOB_ASTRO,
			name: STYLISTIC_CONFIG_NAME_RULES_ASTRO,
			rules: {
				'astro/prefer-class-list-directive': 'error',
				'astro/prefer-object-class-list': 'error',
				'astro/prefer-split-class-list': 'error',
				'astro/semi': 'error',
			},
		},
	];
}

/**
 * Astro overrides for astro code blocks inside markdown. Emitted after the
 * formatting concern, matching the historical order of the resolved config.
 */
export function astroMarkdownAdapter(): TypedFlatConfigItem[] {
	const stylisticPluginRename = PLUGIN_RENAME['@stylistic'];

	return [
		{
			files: GLOB_MARKDOWN_ASTRO,
			name: STYLISTIC_CONFIG_NAME_RULES_MARKDOWN_ASTRO,
			rules: {
				[`${stylisticPluginRename}/indent`]: ['error', 2],
			},
		},
	];
}
