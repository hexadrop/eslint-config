import { cwd } from 'node:process';

import type { Linter } from 'eslint';

import type { TypedFlatConfigItem } from '../../types';
import {
	TYPESCRIPT_CONFIG_NAME_SETUP_PARSER,
	TYPESCRIPT_CONFIG_NAME_SETUP_PARSER_TYPEAWARE,
} from './typescript.config-name';

type TypescriptParser = typeof import('@typescript-eslint/parser');

interface TypescriptParserOptions {
	files: string[];
	ignores?: string[];
	parser: TypescriptParser;
	parserOptions?: Partial<Linter.ParserOptions>;
	tsconfigPath?: string[];
}

export default function typescriptParser({
	files,
	ignores,
	parser,
	parserOptions,
	tsconfigPath,
}: TypescriptParserOptions): TypedFlatConfigItem {
	const config: TypedFlatConfigItem = {
		files,
		languageOptions: {
			parser,
			parserOptions: {
				sourceType: 'module',
				...(tsconfigPath
					? {
							project: tsconfigPath,
							tsconfigRootDir: cwd(),
						}
					: {}),
				...parserOptions,
			},
		},
		name: tsconfigPath ? TYPESCRIPT_CONFIG_NAME_SETUP_PARSER_TYPEAWARE : TYPESCRIPT_CONFIG_NAME_SETUP_PARSER,
	};

	if (ignores) {
		config.ignores = ignores;
	}

	return config;
}
