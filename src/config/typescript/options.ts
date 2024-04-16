import type { ParserOptions } from '@typescript-eslint/parser';

import type { OptionsOverrides } from '../../options';

interface TypeScriptParserOptionsOptions {
	/**
	 * Glob patterns for files that should be type aware.
	 * @default ['**\/*.{ts,tsx}']
	 */
	filesTypeAware?: string[];
	/**
	 * Additional parser options for TypeScript.
	 */
	parserOptions?: Partial<ParserOptions>;
}

interface TypeScriptWithTypesOptions {
	/**
	 * When these options are provided, type aware rules will be enabled.
	 * @see https://typescript-eslint.io/linting/typed-linting/
	 */
	tsconfigPath?: string | string[];
}

interface TypescriptOptions {
	typescript?: boolean
		| (TypeScriptWithTypesOptions & OptionsOverrides)
		| (TypeScriptParserOptionsOptions & OptionsOverrides);
}

export type { TypescriptOptions, TypeScriptWithTypesOptions, TypeScriptParserOptionsOptions };
