import globals from 'globals';

import type { HexatoolEslintOptions } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { ensurePackages, interopDefault, toArray } from '../../utils';
import {
	ASTRO_CONFIG_NAME_RULES,
	ASTRO_CONFIG_NAME_SETUP,
	ASTRO_CONFIG_NAME_SETUP_PARSER,
	ASTRO_CONFIG_NAME_SETUP_PARSER_JAVASCRIPT,
} from './astro.config-name';
import { GLOB_ASTRO, GLOB_ASTRO_JAVASCRIPT, GLOB_ASTRO_TYPESCRIPT } from './astro.globs';

export default async function astro(options: HexatoolEslintOptions): Promise<TypedFlatConfigItem[]> {
	const { astro, typescript } = options;
	if (!astro) {
		return [];
	}

	ensurePackages('eslint-plugin-astro', 'astro-eslint-parser');

	const [plugin, parser, parserTypescript] = await Promise.all([
		interopDefault(import('eslint-plugin-astro')),
		interopDefault(import('astro-eslint-parser')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	const configs: TypedFlatConfigItem[] = [
		{
			name: ASTRO_CONFIG_NAME_SETUP,
			plugins: {
				astro: plugin,
			},
		},
		{
			files: GLOB_ASTRO,
			languageOptions: {
				globals: {
					...globals.node,
					Astro: false,
					Fragment: false,
				},
				parser,
				parserOptions: {
					extraFileExtensions: ['.astro'],
					parser: typescript ? parserTypescript : undefined,
				},
				sourceType: 'module',
			},
			name: ASTRO_CONFIG_NAME_SETUP_PARSER,
			processor: typescript ? 'astro/client-side-ts' : 'astro/astro',
		},
		{
			files: GLOB_ASTRO_JAVASCRIPT,
			languageOptions: {
				globals: {
					...globals.browser,
				},
				sourceType: 'module',
			},
			name: ASTRO_CONFIG_NAME_SETUP_PARSER_JAVASCRIPT,
		},
	];

	if (typescript) {
		configs.push({
			files: GLOB_ASTRO_TYPESCRIPT,
			languageOptions: {
				globals: {
					...globals.browser,
				},
				parser: parserTypescript,
				parserOptions: {
					project: typescript === true ? undefined : toArray(typescript),
				},
				sourceType: 'module',
			},
			name: ASTRO_CONFIG_NAME_SETUP_PARSER_JAVASCRIPT,
		});
	}

	configs.push({
		files: GLOB_ASTRO,
		name: ASTRO_CONFIG_NAME_RULES,
		rules: {
			'astro/missing-client-only-directive-value': 'error',
			'astro/no-conflict-set-directives': 'error',
			'astro/no-deprecated-astro-canonicalurl': 'error',
			'astro/no-deprecated-astro-fetchcontent': 'error',
			'astro/no-deprecated-astro-resolve': 'error',
			'astro/no-deprecated-getentrybyslug': 'error',
			'astro/no-unused-define-vars-in-style': 'error',
			'astro/valid-compile': 'error',
		},
	});

	return configs;
}
