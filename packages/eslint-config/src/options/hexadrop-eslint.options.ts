import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import type { CoreTypescriptOptions } from '@hexadrop/eslint-config-core';
import type { ReactConfigOptions } from '@hexadrop/eslint-config-react';
import type { Nullable, RecursivePartial } from '@hexadrop/eslint-config-shared';
import { getWorkspaceDirectories, getWorkspacePackageInfo } from '@hexadrop/eslint-config-shared';
import type { StylisticFormattingOptions } from '@hexadrop/eslint-config-stylistic';
import type { TypescriptParserOptions } from '@hexadrop/eslint-config-typescript';
import { isPackageExists } from 'local-pkg';

import type { HexadropEslintIgnoreOptions } from './hexadrop-eslint-ignore.options';
import type { HexadropEslintModulesOptions } from './hexadrop-eslint-module.options';

/**
 * The meta-package keeps the formatting, unicorn, perfectionist and format
 * toggles nested under `stylistic` for backwards compatibility. The extracted
 * `@hexadrop/eslint-config-stylistic` package exposes `format`, `unicorn` and
 * `perfectionist` as top-level factory options instead.
 */
interface HexadropEslintStylisticOptions extends StylisticFormattingOptions {
	/**
	 * Enable formatting rules.
	 *
	 * @default true
	 */
	format: boolean;

	/**
	 * Enable perfectionist rules.
	 *
	 * @default true
	 */
	perfectionist: boolean;

	/**
	 * Enable unicorn rules.
	 *
	 * @default true
	 */
	unicorn: boolean;
}

/**
 * The react preset options the meta-package exposes. `typescript` is not
 * forwarded: the top-level `typescript` option already decides it for every
 * slice.
 */
type HexadropEslintReactOptions = Pick<ReactConfigOptions, 'refresh'>;

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
	 * Pass an object to customize the react preset (`refresh`).
	 */
	react: boolean | HexadropEslintReactOptions;

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
	 * If `true`, typescript support will be enabled without type-aware
	 * linting; use a string, array or object to lint with type information.
	 * If a string or string[], enables type-aware linting with those tsconfig paths.
	 * If an object, allows passing {@link TypescriptOptions.project},
	 * {@link TypescriptOptions.tsconfigRootDir}, {@link TypescriptOptions.resolver}
	 * and {@link TypescriptOptions.parserOptions}.
	 * If you leave empty, automatic detection will be used: the root
	 * `tsconfig.json` when there is one, which a solution-style root expands
	 * into its referenced projects; otherwise the `tsconfig.json` of every
	 * workspace package (`package.json#workspaces` or `pnpm-workspace.yaml`).
	 *
	 */
	typescript: boolean | string | string[] | TypescriptOptions;
}

/**
 * The resolved options after {@link defaultOptions} has normalised user input.
 *
 * Differs from {@link HexadropEslintOptions} in that `typescript` is always
 * `boolean | TypescriptOptions` — bare strings and arrays have already been
 * folded into `{ project: … }`.
 */
type ResolvedHexadropEslintOptions = Omit<HexadropEslintOptions, 'typescript'> & {
	typescript: boolean | TypescriptOptions;
};

interface TypescriptOptions extends CoreTypescriptOptions {
	/**
	 * Extra parser options merged into the TypeScript parser config after the
	 * internal `project`/`tsconfigRootDir`.
	 *
	 * Use `projectService` to let typescript-eslint resolve the project per
	 * file (solution-style tsconfigs, workspaces). `project` is omitted in that
	 * mode so both resolution modes are never enabled at the same time.
	 */
	parserOptions?: Partial<TypescriptParserOptions>;
}

/**
 * Resolve the default TypeScript project(s) without consumer input.
 *
 * A root `tsconfig.json` wins and keeps its bare `'tsconfig.json'` form
 * (solution-style roots are expanded by the TypeScript and import packages).
 * When the root has no tsconfig, the tsconfigs of the workspace packages are
 * used, which covers monorepos whose root only holds tooling configuration.
 */
function getDefaultTypescriptProject(): string | string[] | undefined {
	const root = process.cwd();

	if (existsSync(path.resolve(root, 'tsconfig.json'))) {
		return 'tsconfig.json';
	}

	const projects = getWorkspaceDirectories(root)
		.map(directory => path.join(directory, 'tsconfig.json'))
		.filter(file => existsSync(file))
		.map(file => {
			const relative = path.relative(root, file).split(path.sep).join('/');

			return relative.startsWith('..') ? relative : `./${relative}`;
		});

	return projects.length > 0 ? projects : undefined;
}

/**
 * Whether a package is installed in the root or in any workspace package.
 *
 * `local-pkg` resolves `node_modules` from each directory and its ancestors, so
 * this covers React or TypeScript hoisted to the repository root as well as
 * installed in a child package by an isolated workspace layout.
 */
function isWorkspacePackageInstalled(name: string): boolean {
	return getWorkspacePackageInfo(name) !== undefined;
}

export type {
	HexadropEslintOptions,
	HexadropEslintReactOptions,
	HexadropEslintStylisticOptions,
	ResolvedHexadropEslintOptions,
	TypescriptOptions,
};

export default function defaultOptions(
	options: RecursivePartial<HexadropEslintOptions> = {}
): ResolvedHexadropEslintOptions {
	let typescript: ResolvedHexadropEslintOptions['typescript'] = false;
	const isInstalledTypescript = isWorkspacePackageInstalled('typescript');
	const isInstalledReact = isWorkspacePackageInstalled('react');
	const isInstalledAstro = isPackageExists('astro');

	/* eslint-disable typescript/no-unnecessary-condition -- RecursivePartial narrows types but runtime checks are needed */
	if (options.typescript === true) {
		typescript = true;
	} else if (typeof options.typescript === 'string') {
		typescript = { project: options.typescript.length > 0 ? options.typescript : true };
	} else if (Array.isArray(options.typescript)) {
		typescript = {
			project: options.typescript.length > 0 ? (options.typescript.filter(Boolean) as string[]) : true,
		};
	} else if (typeof options.typescript === 'object' && options.typescript !== null) {
		const tsOptions = options.typescript as TypescriptOptions;
		const hasProject = tsOptions.project !== undefined;
		const hasProjectService = Boolean(tsOptions.parserOptions?.projectService);

		/*
		 * `projectService: false` disables the only resolution mode the object
		 * form asked for, so fall back to detection instead of shipping a config
		 * that silently turns TypeScript support off.
		 */
		typescript =
			hasProject || hasProjectService
				? { ...tsOptions }
				: { ...tsOptions, project: getDefaultTypescriptProject() ?? true };
	} else if (isInstalledTypescript && options.typescript === undefined) {
		typescript = { project: getDefaultTypescriptProject() ?? true };
	}

	return {
		astro: options.astro ?? isInstalledAstro,
		ignore:
			typeof options.ignore === 'object'
				? {
						...options.ignore,
						files:
							typeof options.ignore.files === 'string'
								? options.ignore.files
								: ((options.ignore.files?.filter(Boolean) as Nullable<string[]>) ?? []),
						filesGitModules:
							typeof options.ignore.filesGitModules === 'string'
								? options.ignore.filesGitModules
								: ((options.ignore.filesGitModules?.filter(Boolean) as Nullable<string[]>) ?? []),
						globs: (options.ignore.globs?.filter(Boolean) as Nullable<string[]>) ?? [],
						recursive:
							typeof options.ignore.recursive === 'boolean'
								? options.ignore.recursive
								: typeof options.ignore.recursive === 'object' && options.ignore.recursive.skipDirs
									? {
											skipDirs: options.ignore.recursive.skipDirs.filter(Boolean) as string[],
										}
									: false,
					}
				: (options.ignore ?? true),
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
		react: (options.react ?? isInstalledReact) as boolean | HexadropEslintReactOptions,
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
