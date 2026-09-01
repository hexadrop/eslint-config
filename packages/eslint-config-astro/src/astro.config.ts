import { interopDefault } from '@hexadrop/eslint-config-shared';
import globals from 'globals';
import { isPackageExists } from 'local-pkg';

import {
	ASTRO_CONFIG_NAME_RULES,
	ASTRO_CONFIG_NAME_SETUP,
	ASTRO_CONFIG_NAME_SETUP_PARSER,
	ASTRO_CONFIG_NAME_SETUP_PARSER_JAVASCRIPT,
	ASTRO_CONFIG_NAME_SETUP_PARSER_TYPESCRIPT,
} from './astro.config-name';
import { GLOB_ASTRO, GLOB_ASTRO_JAVASCRIPT, GLOB_ASTRO_TYPESCRIPT } from './astro.globs';
import type { TypedFlatConfigItem } from './astro.typed-config';

const TYPESCRIPT_PACKAGE_NAME = '@hexadrop/eslint-config-typescript';

interface HexadropEslintAstroOptions {
	/**
	 * Enable astro support.
	 *
	 * @default true
	 */
	astro?: boolean | undefined;

	/**
	 * Skip the optional-peer check when enabling the typescript flavor.
	 *
	 * Internal escape hatch for integrators that own the typescript concern
	 * themselves (the `@hexadrop/eslint-config` meta-package). Standalone
	 * consumers should never set this.
	 *
	 * @default true
	 * @internal
	 */
	peerCheck?: boolean | undefined;

	/**
	 * Enable the typescript parsing path for `.astro` files.
	 *
	 * When `undefined`, the typescript path activates automatically when the
	 * optional peer `@hexadrop/eslint-config-typescript` is installed. Passing
	 * `true` while the peer is missing throws an actionable install error.
	 */
	typescript?: boolean | undefined;
}

async function astroConfig(options: HexadropEslintAstroOptions): Promise<TypedFlatConfigItem[]> {
	const { astro: enabled, peerCheck = true, typescript: typescriptOption } = options;
	if (!enabled) {
		return [];
	}

	/*
	 * `typescript: true` requires the optional peer's parser to be resolvable.
	 * Integrators that own the typescript concern (the
	 * `@hexadrop/eslint-config` meta-package) resolve it themselves and opt
	 * out of the check with `peerCheck: false`.
	 */
	const isTypescriptPeerInstalled = isPackageExists(TYPESCRIPT_PACKAGE_NAME);
	if (typescriptOption === true && !isTypescriptPeerInstalled && peerCheck) {
		throw new Error(
			`The "typescript" option of @hexadrop/eslint-config-astro requires the optional peer "${TYPESCRIPT_PACKAGE_NAME}" to be installed. Install it with: bun add --dev ${TYPESCRIPT_PACKAGE_NAME}`
		);
	}
	const isTypescript = typescriptOption ?? isTypescriptPeerInstalled;

	const [plugin, parser] = await Promise.all([
		interopDefault(import('eslint-plugin-astro')),
		interopDefault(import('astro-eslint-parser')),
	] as const);

	const parserTypescript = isTypescript ? await interopDefault(import('@typescript-eslint/parser')) : undefined;

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
					parser: isTypescript ? parserTypescript : undefined,
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
		configs.push({
			files: GLOB_ASTRO_TYPESCRIPT,
			languageOptions: {
				globals: {
					...globals.browser,
				},
				parser: parserTypescript,
				sourceType: 'module',
			},
			name: ASTRO_CONFIG_NAME_SETUP_PARSER_TYPESCRIPT,
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

export type { HexadropEslintAstroOptions };

export default astroConfig;
