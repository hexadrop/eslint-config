import { cwd } from 'node:process';

import type { Linter } from 'eslint';

import type { TypedFlatConfigItem } from '../../types';

type TypescriptParser = typeof import('@typescript-eslint/parser');

const TYPESCRIPT_PARSER_CONFIG_NAME = 'hexatool/typescript/parser';

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
	tsconfigPath,
	parserOptions,
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
		name: `${TYPESCRIPT_PARSER_CONFIG_NAME}${tsconfigPath ? '/type-aware' : ''}`,
	};

	if (ignores) {
		config.ignores = ignores;
	}

	return config;
}
