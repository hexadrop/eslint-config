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
	parserOptions?: Partial<ParserOptions> | undefined;
	tsconfigPath?: string[];
	tsconfigRootDir?: string;
}

export default function typescriptParser({
	files,
	ignores,
	parser,
	parserOptions,
	tsconfigPath,
	tsconfigRootDir,
}: TypescriptParserOptions): TypedFlatConfigItem {
	const isTypeAware = Boolean(tsconfigPath) || Boolean(parserOptions?.projectService);
	const config: TypedFlatConfigItem = {
		files,
		languageOptions: {
			parser,
			parserOptions: {
				sourceType: 'module',
				...(tsconfigPath && {
					project: tsconfigPath,
					tsconfigRootDir: tsconfigRootDir ?? cwd(),
				}),
				...parserOptions,
			},
		},
		name: isTypeAware ? TYPESCRIPT_CONFIG_NAME_SETUP_PARSER_TYPEAWARE : TYPESCRIPT_CONFIG_NAME_SETUP_PARSER,
	};

	if (ignores) {
		config.ignores = ignores;
	}

	return config;
}
