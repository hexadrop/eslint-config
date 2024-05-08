import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';

interface HexatoolEslintStylisticOptions {
	/**
	 * Include parentheses around a sole arrow function parameter.
	 *
	 * @default 'avoid'
	 */
	arrowParens: 'always' | 'avoid';

	/**
	 * Which brace style to use
	 *
	 * @default '1tbs'
	 */
	braceStyle: '1tbs' | 'allman' | 'stroustrup';

	/**
	 * Put the > of a multi-line HTML (HTML, JSX, Vue, Angular) element
	 * at the end of the last line instead of being alone on the next line.
	 *
	 * @default true
	 */
	bracketSameLine: boolean;

	/**
	 * Use spaces between brackets in object literals.
	 *
	 * @default true
	 */
	bracketSpacing: boolean;

	/**
	 * End of line character.
	 *
	 * @default 'lf'
	 */
	endOfLine: 'auto' | 'cr' | 'crlf' | 'lf';

	/**
	 * Enable formatting rules.
	 *
	 * @default true
	 */
	format: boolean;

	/**
	 * Enable import rules.
	 *
	 * @default true
	 */
	imports: boolean;

	/**
	 * Indentation style.
	 *
	 * @default 'tab'
	 */
	indent: 'space' | 'tab';

	/**
	 * Number of spaces to use for indentation.
	 *
	 * @default 4
	 */
	indentSize: number;

	/**
	 * Enable perfectionist rules.
	 *
	 * @default true
	 */
	perfectionist: boolean;

	/**
	 * Specify the line length that the printer will wrap on.
	 *
	 * @default 120
	 */
	printWidth: number;

	/**
	 * Change when properties in objects are quoted.
	 *
	 * @default 'as-needed'
	 */
	quoteProps: 'as-needed' | 'consistent' | 'preserve';

	/**
	 * Quote style.
	 *
	 * @default 'single'
	 */
	quotes: 'double' | 'single';

	/**
	 * Use semicolons at the end of statements.
	 *
	 * @default true
	 */
	semicolons: boolean;

	/**
	 * Use single attribute per line in HTML, Vue and JSX.
	 *
	 * @default false
	 */
	singleAttributePerLine: boolean;

	/**
	 * Use trailing commas in multi-line object literals.
	 *
	 * @default 'es5'
	 */
	trailingComma: 'all' | 'es5' | 'none';

	/**
	 * Enable unicorn rules.
	 *
	 * @default true
	 */
	unicorn: boolean;
}

interface HexatoolEslintIgnoreOptions extends Omit<FlatGitignoreOptions, 'name'> {
	/**
	 * Additional ignore patterns.
	 */
	globs?: string[];
}

interface HexatoolEslintModulesOptions {
	/*
	 * Enable AMD support.
	 *
	 * @default false
	 */
	amd: boolean;

	/*
	 * Enable CommonJS support.
	 *
	 * @default false
	 */
	commonjs: boolean;

	/**
	 * Enable use of core node modules.
	 *
	 * @default true
	 */
	node: boolean;

	/**
	 * Enable webpack support.
	 *
	 * @default false
	 */
	webpack: boolean;
}

interface HexatoolEslintOptions {
	/**
	 * Enable ignore support.
	 *
	 * Passing an object to configure the options.
	 *
	 * @see https://github.com/antfu/eslint-config-flat-gitignore
	 *
	 * @default true
	 */
	ignore: HexatoolEslintIgnoreOptions | boolean;

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
	module: HexatoolEslintModulesOptions;

	/**
	 * Use node rules.
	 *
	 * @default true
	 */
	node: boolean;

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
	stylistic: HexatoolEslintStylisticOptions | false;

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

export type { HexatoolEslintOptions, HexatoolEslintStylisticOptions };

export default function defaultOptions(options: Partial<HexatoolEslintOptions> = {}): HexatoolEslintOptions {
	let typescript: boolean | string | string[] = false;

	if (options.typescript === true) {
		typescript = true;
	} else if (options.typescript === undefined) {
		typescript = getCwdTsconfigPath() ?? true;
	} else if (options.typescript === 'string' || Array.isArray(options.typescript)) {
		typescript = options.typescript.length > 0 ? options.typescript : true;
	}

	return {
		ignore: options.ignore ?? true,
		imports: options.imports ?? true,
		json: options.json ?? true,
		markdown: options.markdown ?? true,
		module: {
			amd: false,
			commonjs: false,
			node: true,
			webpack: false,
			...options.module,
		},
		node: options.node ?? true,
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
