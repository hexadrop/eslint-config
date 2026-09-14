import {
	ASTRO_CONFIG_NAME_RULES,
	ASTRO_CONFIG_NAME_SETUP,
	ASTRO_CONFIG_NAME_SETUP_PARSER,
	ASTRO_CONFIG_NAME_SETUP_PARSER_JAVASCRIPT,
	GLOB_ASTRO,
	GLOB_ASTRO_JAVASCRIPT,
	GLOB_ASTRO_TYPESCRIPT,
	interopDefault,
	toArray,
} from '@hexadrop/eslint-config-shared';
import globals from 'globals';
import { isPackageExists } from 'local-pkg';

import type { TypedFlatConfigItem } from './astro.typed-config';

function isTypescriptEnabled(options: AstroConfigOptions): boolean {
	if (options.typescript !== undefined) {
		if (options.typescript && !isPackageExists('@hexadrop/eslint-config-typescript')) {
			throw new Error(
				'Astro typescript integration is enabled but @hexadrop/eslint-config-typescript is not installed. ' +
					'Install it with your package manager or set typescript: false to disable TS support.'
			);
		}

		return Boolean(options.typescript);
	}

	return isPackageExists('@hexadrop/eslint-config-typescript');
}

export default async function astroConfig(options: AstroConfigOptions = {}): Promise<TypedFlatConfigItem[]> {
	const isTypescript = isTypescriptEnabled(options);

	const [plugin, parser] = await Promise.all([
		interopDefault(import('eslint-plugin-astro')),
		interopDefault(import('astro-eslint-parser')),
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
					parser: undefined,
				},
				sourceType: 'module',
			},
			name: ASTRO_CONFIG_NAME_SETUP_PARSER,
			processor: isTypescript ? 'astro/client-side-ts' : 'astro/astro',
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

	if (isTypescript) {
		const parserTypescript = await interopDefault(import('@typescript-eslint/parser'));

		configs.push({
			files: GLOB_ASTRO_TYPESCRIPT,
			languageOptions: {
				globals: {
					...globals.browser,
				},
				parser: parserTypescript,
				parserOptions: {
					project: options.typescript === true ? undefined : toArray(options.typescript as string | string[]),
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
			'no-useless-assignment': 'off',
		},
	});

	return configs;
}

export interface AstroConfigOptions {
	/**
	 * Whether typescript support should be enabled (TS parsing, TS script linting).
	 *
	 * When omitted, auto-detected via `@hexadrop/eslint-config-typescript` presence.
	 * Set explicitly to override auto-detection: `false` forces JS-only mode,
	 * `true` forces TS mode — throws an actionable error if the peer is not installed.
	 *
	 * @default undefined (auto-detect)
	 */
	typescript?: boolean | string | string[];
}
