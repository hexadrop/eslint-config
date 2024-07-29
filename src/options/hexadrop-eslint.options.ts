import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { isPackageExists } from 'local-pkg';

import type { Nullable, RecursivePartial } from '../types';
import type { HexadropEslintIgnoreOptions } from './hexadrop-eslint-ignore.options';
import type { HexadropEslintModulesOptions } from './hexadrop-eslint-module.options';
import type { HexadropEslintStylisticOptions } from './hexadrop-eslint-stylistic.options';

interface HexadropEslintOptions {
	/**
	 * Enable astro support.
	 *
	 * If `false`, astro support will be disabled.
	 * If `true`, or empty it will be enabled.
	 */
	astro: boolean;

	/**
	 * Enable ignore support.
	 *
	 * Passing an object to configure the options.
	 *
	 * @see https://github.com/antfu/eslint-config-flat-gitignore
	 *
	 * @default true
	 */
	ignore: boolean | HexadropEslintIgnoreOptions;

	/**
	 * Enable import rules.
	 *
	 * @default true
	 */
	imports: boolean;

	/**
	 * Enable json support.
	 *
	 * @default true
	 */
	json: boolean;

	/**
	 * Enable markdown support.
	 *
	 * @default true
	 */
	markdown: boolean;

	/**
	 * Configure module imports.
	 *
	 * @default { amd: false, commonjs: false, node: true, webpack: false }
	 */
	module: HexadropEslintModulesOptions;

	/**
	 * Use node rules.
	 *
	 * @default true
	 */
	node: boolean;

	/**
	 * Enable react support.
	 *
	 * If `false`, react support will be disabled.
	 * If `true`, or empty it will be enabled.
	 */
	react: boolean;

	/**
	 * Configure stylistic rules.
	 *
	 * @default {
	 * 	arrowParens: 'avoid',
	 * 	braceStyle: '1tbs',
	 * 	bracketSameLine: true,
	 * 	bracketSpacing: true,
	 * 	endOfLine: 'lf',
	 * 	format: true,
	 * 	imports: true,
	 * 	indent: 'tab',
	 * 	indentSize: 4,
	 * 	perfectionist: true,
	 * 	quoteProps: 'as-needed',
	 * 	quotes: 'single',
	 * 	semicolons: true,
	 * 	singleAttributePerLine: true,
	 * 	trailingComma: 'es5',
	 * 	unicorn: true,
	 * }
	 */
	stylistic: false | HexadropEslintStylisticOptions;

	/**
	 * Configure typescript support.
	 *
	 * If `false`, typescript support will be disabled.
	 * If `true`, typescript support will be enabled with default options.
	 * If you leave empty, automatic detection will be used.
	 *
	 */
	typescript: boolean | string | string[];
}

function getCwdTsconfigPath(): string | undefined {
	const root = process.cwd();
	const cwdTsconfigPath = path.resolve(root, 'tsconfig.json');
	if (existsSync(cwdTsconfigPath)) {
		return 'tsconfig.json';
	}

	return undefined;
}

export type { HexadropEslintOptions };

export default function defaultOptions(options: RecursivePartial<HexadropEslintOptions> = {}): HexadropEslintOptions {
	let typescript: boolean | string | string[] = false;
	const installedTypescript = isPackageExists('typescript');
	const installedReact = isPackageExists('react');
	const installedAstro = isPackageExists('astro');

	if (options.typescript === true) {
		typescript = true;
	} else if (installedTypescript) {
		if (options.typescript === undefined) {
			typescript = getCwdTsconfigPath() ?? true;
		} else if (options.typescript === 'string') {
			typescript = options.typescript.length > 0 ? options.typescript : true;
		} else if (Array.isArray(options.typescript)) {
			typescript = options.typescript.length > 0 ? (options.typescript.filter(Boolean) as string[]) : true;
		}
	}

	return {
		astro: options.astro ?? installedAstro,
		ignore:
			typeof options.ignore === 'object'
				? {
						...options.ignore,
						files:
							typeof options.ignore.files === 'string'
								? options.ignore.files
								: (options.ignore.files?.filter(Boolean) as Nullable<string[]>) ?? [],
						globs: (options.ignore.globs?.filter(Boolean) as Nullable<string[]>) ?? [],
					}
				: options.ignore ?? true,
		imports: options.imports ?? true,
		json: options.json ?? true,
		markdown: options.markdown ?? true,
		module: {
			amd: false,
			commonjs: false,
			node: true,
			webpack: false,
			...options.module,
			ignore: [
				String.raw`bun\:.*`,
				String.raw`astro\:.*`,
				...((options.module?.ignore?.filter(Boolean) as Nullable<string[]>) ?? []),
			],
		},
		node: options.node ?? true,
		react: options.react ?? installedReact,
		stylistic:
			options.stylistic === false
				? false
				: {
						arrowParens: 'avoid',
						braceStyle: '1tbs',
						bracketSameLine: true,
						bracketSpacing: true,
						endOfLine: 'lf',
						format: true,
						imports: true,
						indent: 'tab',
						indentSize: 4,
						perfectionist: true,
						printWidth: 120,
						quoteProps: 'as-needed',
						quotes: 'single',
						semicolons: true,
						singleAttributePerLine: true,
						trailingComma: 'es5',
						unicorn: true,

						...options.stylistic,
					},
		typescript,
	};
}
