import { isPackageExists } from 'local-pkg';

import type { OptionsOverrides, StylisticConfig } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { ensurePackages, interopDefault } from '../../utils';
import { GLOB_ASTRO } from './globs';
import type { AstroOptions } from './options';

export default async function astro(
	options: AstroOptions['astro'] = isPackageExists('astro'),
	stylistic: (OptionsOverrides & StylisticConfig) | false = {},
): Promise<TypedFlatConfigItem[]> {
	if (!options) {
		return [];
	}

	const {
		overrides = {},
	} = typeof options === 'object' ? options : {};

	ensurePackages(
		'eslint-plugin-astro',
		'astro-eslint-parser',
	);

	const files = [GLOB_ASTRO];

	const [
		pluginAstro,
		parserAstro,
		parserTs,
	] = await Promise.all([
		interopDefault(import('eslint-plugin-astro')),
		interopDefault(import('astro-eslint-parser')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	return [
		{
			name: 'hexatool/astro/setup',
			plugins: {
				astro: pluginAstro,
			},
		},
		{
			files,
			languageOptions: {
				parser: parserAstro,
				parserOptions: {
					extraFileExtensions: ['.astro'],
					parser: parserTs as any,
				},
			},
			name: 'hexatool/astro/rules',
			rules: {
				...pluginAstro.configs.recommended.rules,
				'astro/no-set-html-directive': 'error',
				'astro/no-set-text-directive': 'error',
				'astro/no-unused-css-selector': 'error',

				...stylistic
					? {
							'astro/prefer-class-list-directive': 'error',
							'astro/prefer-object-class-list': 'error',
							'astro/prefer-split-class-list': 'error',
							'astro/semi': 'error',
						}
					: {},

				...overrides,
			},
		},
	];
}
