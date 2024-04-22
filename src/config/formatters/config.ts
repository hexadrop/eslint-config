import { isPackageExists } from 'local-pkg';

import type { OptionsOverrides, StylisticConfig } from '../../options';
import type { TypedFlatConfigItem, VendoredPrettierOptions } from '../../types';
import { ensurePackages, interopDefault, parserPlain } from '../../utils';
import { GLOB_ASTRO } from '../astro';
import { GLOB_MARKDOWN } from '../markdown';
import { StylisticConfigDefaults } from '../stylistic';
import { GLOB_CSS, GLOB_LESS, GLOB_POSTCSS, GLOB_SCSS } from './globs';
import type { FormattersOptions, OptionsFormatters } from './options';

export default async function formatters(
	options: FormattersOptions['formatters'] = false,
	stylistic: (OptionsOverrides & StylisticConfig) | false = {},
): Promise<TypedFlatConfigItem[]> {
	if (!options) {
		return [];
	}
	const optionsObject: OptionsFormatters = typeof options === 'boolean'
		? {
				astro: isPackageExists('astro'),
				css: true,
				html: true,
				markdown: true,
			}
		: options;

	ensurePackages(
		'eslint-plugin-format',
		optionsObject.astro ? 'prettier-plugin-astro' : undefined,
	);

	const {
		indent,
		lineLength,
		quotes,
		semi,
	} = {
		...StylisticConfigDefaults,
		...stylistic,
	};

	const prettierOptions: VendoredPrettierOptions = Object.assign(
		{
			endOfLine: 'auto',
			printWidth: lineLength,
			semi,
			singleQuote: quotes === 'single',
			tabWidth: typeof indent === 'number' ? indent : 4,
			trailingComma: 'all',
			useTabs: indent === 'tab',
		},
		optionsObject.prettierOptions ?? {},
	);

	const pluginFormat = await interopDefault(import('eslint-plugin-format'));

	const configs: TypedFlatConfigItem[] = [
		{
			name: 'hexatool/formatter/setup',
			plugins: {
				format: pluginFormat,
			},
		},
	];

	if (optionsObject.css) {
		configs.push(
			{
				files: [
					GLOB_CSS,
					GLOB_POSTCSS,
				],
				languageOptions: {
					parser: parserPlain,
				},
				name: 'hexatool/formatter/css',
				rules: {
					'format/prettier': [
						'error',
						{
							...prettierOptions,
							parser: 'css',
						},
					],
				},
			},
			{
				files: [GLOB_SCSS],
				languageOptions: {
					parser: parserPlain,
				},
				name: 'hexatool/formatter/scss',
				rules: {
					'format/prettier': [
						'error',
						{
							...prettierOptions,
							parser: 'scss',
						},
					],
				},
			},
			{
				files: [GLOB_LESS],
				languageOptions: {
					parser: parserPlain,
				},
				name: 'hexatool/formatter/less',
				rules: {
					'format/prettier': [
						'error',
						{
							...prettierOptions,
							parser: 'less',
						},
					],
				},
			},
		);
	}

	if (optionsObject.html) {
		configs.push({
			files: ['**/*.html'],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'hexatool/formatter/html',
			rules: {
				'format/prettier': [
					'error',
					{
						...prettierOptions,
						parser: 'html',
					},
				],
			},
		});
	}

	if (optionsObject.markdown) {
		const formater = optionsObject.markdown === true
			? 'prettier'
			: optionsObject.markdown;

		configs.push({
			files: [GLOB_MARKDOWN],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'hexatool/formatter/markdown',
			rules: {
				[`format/${formater}`]: [
					'error',
					{
						printWidth: 120,
						...prettierOptions,
						embeddedLanguageFormatting: 'off',
						parser: 'markdown',
					},
				],
			},
		});
	}

	if (optionsObject.astro) {
		configs.push({
			files: [GLOB_ASTRO],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'hexatool/formatter/astro',
			rules: {
				'format/prettier': [
					'error',
					{
						...prettierOptions,
						parser: 'astro',
						plugins: ['prettier-plugin-astro'],
					},
				],
			},
		});
	}

	return configs;
}
