import process from 'node:process';

import type { Linter } from 'eslint';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import {
	astro,
	gitignore,
	imports,
	javascript,
	json,
	node,
	perfectionist,
	react,
	stylistic,
	typescript,
	unicorn,
} from './config';
import type { HexatoolEslintOptions } from './options';
import type { Awaitable, TypedFlatConfigItem } from './types';

const flatConfigProperties: (keyof TypedFlatConfigItem)[] = [
	'name',
	'files',
	'ignores',
	'languageOptions',
	'linterOptions',
	'processor',
	'plugins',
	'rules',
	'settings',
];

const defaultPluginRenaming = {
	'@stylistic': 'style',
	'@typescript-eslint': 'typescript',
	'import-x': 'import',
	jsonc: 'json',
	n: 'node',
	'simple-import-sort': 'import-sort',
	vitest: 'test',
	yml: 'yaml',
};

function isEditor() {
	return Boolean(
		(process.env.VSCODE_PID ?? process.env.VSCODE_CWD ?? process.env.JETBRAINS_IDE ?? process.env.VIM)
		&& !process.env.CI,
	);
}

export default async function hexatool(
	options: HexatoolEslintOptions & TypedFlatConfigItem = {},
	...userConfigs: Awaitable<FlatConfigComposer<any> | Linter.FlatConfig[] | TypedFlatConfigItem | TypedFlatConfigItem[]>[]
): Promise<FlatConfigComposer<TypedFlatConfigItem>> {
	const {
		autoRenamePlugins = true,
		isInEditor = isEditor(),
	} = options;

	const stylisticOptions = options.stylistic === false
		? false
		: (typeof options.stylistic === 'object'
				? options.stylistic
				: {});

	const configs: Awaitable<TypedFlatConfigItem[]>[] = [
		gitignore(options.gitignore),
		javascript(options.javascript, isInEditor),
		imports(stylisticOptions),
		typescript(options.typescript, stylisticOptions),
		stylistic(stylisticOptions),
		json(options.json, stylisticOptions),
		perfectionist(options.perfectionist),
		unicorn(options.unicorn),
		node(),
		react(options.react, options.typescript),
		astro(options.astro, stylisticOptions),
	];

	/*
	 * User can optionally pass a flat config item to the first argument
	 * We pick the known keys as ESLint would do schema validation
	 */
	const fusedConfig = flatConfigProperties.reduce<TypedFlatConfigItem>((accumulator, key) => {
		if (key in options) {
			accumulator[key] = options[key] as any;
		}

		return accumulator;
	}, {});
	if (Object.keys(fusedConfig).length > 0) {
		configs.push([fusedConfig]);
	}

	let pipeline = new FlatConfigComposer<TypedFlatConfigItem>();

	pipeline = pipeline
		.append(
			...configs,
			...userConfigs as any,
		);

	if (autoRenamePlugins) {
		pipeline = pipeline
			.renamePlugins(defaultPluginRenaming);
	}

	return pipeline;
}
