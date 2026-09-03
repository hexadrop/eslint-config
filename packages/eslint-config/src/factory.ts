import type { RecursivePartial } from '@hexadrop/eslint-config-shared';
import { extractTypedFlatConfigItem, PLUGIN_RENAME } from '@hexadrop/eslint-config-shared';
import type { TypescriptFactoryOptions } from '@hexadrop/eslint-config-typescript';
import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import { astro, core, ignore, imports, stylistic } from './config';
import type { HexadropEslintOptions, ResolvedHexadropEslintOptions } from './options';
import defaultOptions from './options/hexadrop-eslint.options';
import type { TypedFlatConfigItem } from './typed-config';
import type { ConfigNames } from './typegen';

function optionalPlugin<TOptions extends unknown[] = []>(
	condition: unknown,
	importFunction: () => Promise<{ config: (...arguments_: TOptions) => Promise<TypedFlatConfigItem[]> }>,
	...arguments_: TOptions
): ResolvableFlatConfig<TypedFlatConfigItem>[] {
	if (!condition) {
		return [];
	}

	return [
		(async () => {
			const imported = await importFunction();

			return imported.config(...arguments_);
		})(),
	];
}

/**
 * Convert resolved options.typescript to the shape the typescript config expects.
 * The resolved value is already `boolean | TypescriptOptions` — no raw strings/arrays.
 */
function toTypescriptFactoryOptions(
	typescript: ResolvedHexadropEslintOptions['typescript']
): TypescriptFactoryOptions | undefined {
	if (typescript === false) {
		return undefined;
	}
	if (typescript === true) {
		return { project: true };
	}

	return typescript;
}

// eslint-disable-next-line typescript/promise-function-async
export default function hexadrop(
	optionsOrFlatConfigItem?: RecursivePartial<HexadropEslintOptions> & TypedFlatConfigItem,
	...configs: ResolvableFlatConfig<TypedFlatConfigItem>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	const options = defaultOptions(optionsOrFlatConfigItem);

	let pipeline = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(
		ignore(options),
		core(options),
		astro(options),
		...optionalPlugin(
			options.typescript,
			() => import('@hexadrop/eslint-config-typescript'),
			toTypescriptFactoryOptions(options.typescript)
		),
		...optionalPlugin(options.react, async () => {
			const m = await import('@hexadrop/eslint-config-react');

			return {
				config: (options_?: Record<string, unknown>) =>
					m.config({ ...(options.typescript === false && { typescript: false as const }), ...options_ }),
			};
		}),
		...optionalPlugin(options.json, () => import('@hexadrop/eslint-config-json')),
		...optionalPlugin(options.markdown, () => import('@hexadrop/eslint-config-markdown')),
		imports(options),
		stylistic(options)
	).renamePlugins(PLUGIN_RENAME);

	/*
	 * User can optionally pass a flat config item to the first argument
	 * We extract it and append it to the pipeline
	 */
	const flatConfig = extractTypedFlatConfigItem(optionsOrFlatConfigItem);
	if (flatConfig) {
		pipeline = pipeline.append(flatConfig);
	}

	pipeline = pipeline.append(...configs);

	return pipeline;
}
