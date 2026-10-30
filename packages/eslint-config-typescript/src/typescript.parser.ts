import { cwd } from 'node:process';

import {
	TYPESCRIPT_CONFIG_NAME_SETUP_PARSER,
	TYPESCRIPT_CONFIG_NAME_SETUP_PARSER_TYPEAWARE,
} from '@hexadrop/eslint-config-shared';
import type { ParserOptions } from '@typescript-eslint/parser';

import type { TypedFlatConfigItem } from './typescript.typed-config';

type TypescriptParser = typeof import('@typescript-eslint/parser');

interface TypescriptParserOptions {
	files: string[];
	ignores?: string[];
	parser: TypescriptParser;
	parserOptions?: Partial<ParserOptions>;
	tsconfigPath?: string[];
	tsconfigRootDir?: string;
}

/**
 * Whether the parser resolves projects explicitly or through `projectService`.
 * Shared with the config so the parser and the rule slices agree.
 */
export function isTypeAware(tsconfigPath?: string[], parserOptions?: Partial<ParserOptions>): boolean {
	return Boolean(tsconfigPath) || Boolean(parserOptions?.projectService);
}

export default function typescriptParser({
	files,
	ignores,
	parser,
	parserOptions,
	tsconfigPath,
	tsconfigRootDir,
}: TypescriptParserOptions): TypedFlatConfigItem {
	const resolvedTsconfigRootDirectory = tsconfigRootDir ?? (tsconfigPath ? cwd() : undefined);
	const config: TypedFlatConfigItem = {
		files,
		languageOptions: {
			parser,
			parserOptions: {
				sourceType: 'module',
				...(tsconfigPath && { project: tsconfigPath }),
				...(resolvedTsconfigRootDirectory && { tsconfigRootDir: resolvedTsconfigRootDirectory }),
				...parserOptions,
			},
		},
		name: isTypeAware(tsconfigPath, parserOptions)
			? TYPESCRIPT_CONFIG_NAME_SETUP_PARSER_TYPEAWARE
			: TYPESCRIPT_CONFIG_NAME_SETUP_PARSER,
	};

	if (ignores) {
		config.ignores = ignores;
	}

	return config;
}
