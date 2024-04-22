import type { Linter } from 'eslint';

const parserPlain: Linter.FlatConfigParserModule = {
	meta: {
		name: 'parser-plain',
	},
	parseForESLint: (code: string): {
		ast: unknown;
		scopeManager?: unknown;
	} & Omit<Linter.ESLintParseResult, 'ast' | 'scopeManager'> => ({
		ast: {
			body: [],
			comments: [],
			loc: { end: code.length, start: 0 },
			range: [
				0,
				code.length,
			],
			tokens: [],
			type: 'Program',
		},
		visitorKeys: {
			Program: [],
		},
	}),
};

export default parserPlain;
