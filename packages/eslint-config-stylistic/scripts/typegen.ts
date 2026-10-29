import { writeFlatConfigs } from '@hexadrop/eslint-config-shared';

import stylisticConfig from '../src/stylistic.config';

// All sections on so ConfigNames covers the peer matrix.
const configs = await stylisticConfig({
	astro: true,
	format: true,
	isTypeAware: true,
	json: true,
	markdown: true,
	perfectionist: true,
	stylistic: {
		arrowParens: 'avoid',
		braceStyle: '1tbs',
		bracketSameLine: true,
		bracketSpacing: true,
		endOfLine: 'lf',
		indent: 'tab',
		indentSize: 4,
		printWidth: 120,
		quoteProps: 'as-needed',
		quotes: 'single',
		semicolons: true,
		singleAttributePerLine: true,
		trailingComma: 'es5',
	},
	typescript: true,
	unicorn: true,
});

await writeFlatConfigs(configs, 'src/typegen.d.ts');
