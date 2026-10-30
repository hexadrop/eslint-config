import type { RecursivePartial } from '@hexadrop/eslint-config-shared';
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import type { TypeScriptResolverOptions } from 'eslint-import-resolver-typescript';

import type { TypedFlatConfigItem } from './core.typed-config';

interface CoreIgnoreOptions extends Omit<FlatGitignoreOptions, 'name'> {
	/**
	 * Additional ignore patterns.
	 */
	globs?: string[];
}

interface CoreTypescriptOptions {
	/**
	 * tsconfig path or paths forwarded to the TypeScript import resolver.
	 *
	 * `true` enables TypeScript import resolution without an explicit project;
	 * a path or list of paths enables type-aware alias resolution.
	 */
	project?: boolean | string | string[];

	/**
	 * Options forwarded to `eslint-import-resolver-typescript`.
	 *
	 * @see https://github.com/import-js/eslint-import-resolver-typescript
	 */
	resolver?: TypeScriptResolverOptions;

	/**
	 * Root directory the project paths are resolved from. Defaults to `cwd()`.
	 */
	tsconfigRootDir?: string;
}

interface CoreModuleOptions {
	/**
	 * Enable AMD support.
	 *
	 * @default false
	 */
	amd: boolean;

	/**
	 * Enable CommonJS support.
	 *
	 * @default false
	 */
	commonjs: boolean;

	/**
	 * Ignore node modules to prevent `import/no-unresolved` false positives.
	 */
	ignore: string[];

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

interface CoreOptions {
	/**
	 * Enable astro support.
	 */
	astro: boolean;

	/**
	 * Enable ignore support.
	 *
	 * Passing an object to configure the options.
	 */
	ignore: boolean | CoreIgnoreOptions;

	/**
	 * Enable import rules.
	 */
	imports: boolean;

	/**
	 * Enable json support.
	 */
	json: boolean;

	/**
	 * Enable markdown support.
	 */
	markdown: boolean;

	/**
	 * Configure module imports.
	 */
	module: CoreModuleOptions;

	/**
	 * Use node rules.
	 */
	node: boolean;

	/**
	 * Enable stylistic-aware import rules.
	 */
	stylistic: boolean | object;

	/**
	 * Enable typescript-aware import rules.
	 *
	 * Pass the resolved TypeScript options (project, tsconfigRootDir and import
	 * resolver options) to resolve path aliases in `import/no-unresolved`.
	 */
	typescript: boolean | CoreTypescriptOptions;
}

type CoreFactoryOptions = RecursivePartial<CoreOptions> & TypedFlatConfigItem;

const defaultCoreOptions = (options: RecursivePartial<CoreOptions> = {}): CoreOptions => ({
	astro: options.astro ?? false,
	ignore: (options.ignore ?? true) as boolean | CoreIgnoreOptions,
	imports: options.imports ?? true,
	json: options.json ?? false,
	markdown: options.markdown ?? false,
	module: {
		amd: false,
		commonjs: false,
		node: true,
		webpack: false,
		...options.module,
		ignore: [
			String.raw`bun\:.*`,
			String.raw`astro\:.*`,
			...((options.module?.ignore?.filter(Boolean) as string[] | undefined) ?? []),
		],
	},
	node: options.node ?? true,
	stylistic: Boolean(options.stylistic),
	typescript: (options.typescript ?? false) as boolean | CoreTypescriptOptions,
});

export type { CoreFactoryOptions, CoreIgnoreOptions, CoreModuleOptions, CoreOptions, CoreTypescriptOptions };

export default defaultCoreOptions;
