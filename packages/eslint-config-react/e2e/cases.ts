import type { Linter } from 'eslint';

import type { HexadropEslintReactOptions } from '../src';

interface EndToEndCase {
	/**
	 * Extra flat config items appended after the react slice, e.g. to pin
	 * `settings.react.version` because `version: 'detect'` cannot resolve react
	 * from the fixture directories.
	 */
	extraConfigs?: Linter.Config[];
	/**
	 * React fixture file at e2e/fixtures/<file>.
	 */
	file: string;
	options?: HexadropEslintReactOptions;
	slug: string;
}

/**
 * End-to-end scenarios over real fixture files, mirroring the strategy of
 * packages/eslint-config-markdown (in turn following
 * packages/eslint-config-json and packages/eslint-config): each fixture is run
 * through the real ESLint engine with `fix` enabled. Two snapshots are frozen
 * per file: the diagnostics that survive and the resulting file content,
 * pinning the rule wiring against regressions.
 *
 * `@hexadrop/eslint-config-typescript` is not installed in this repository, so
 * the optional peer is absent and only the js flavor can run end to end here.
 */
export const END_TO_END_CASES: EndToEndCase[] = [
	{
		/*
		 * `version: 'detect'` cannot resolve react from fixture dirs, so the
		 * version is pinned. The jsx parser feature belongs to the core slice of
		 * the meta-package, so it is enabled here for the standalone run.
		 */
		extraConfigs: [
			{
				languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
				name: 'e2e/react-setup',
				settings: { react: { version: '19' } },
			},
		],
		file: 'react.jsx',
		options: { typescript: false },
		slug: 'jsx',
	},
	{
		file: 'disabled.jsx',
		options: { react: false, typescript: false },
		slug: 'disabled',
	},
];

export type { EndToEndCase };
