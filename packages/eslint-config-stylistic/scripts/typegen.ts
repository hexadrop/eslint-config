import { writeFlatConfigs } from '@hexadrop/eslint-config-shared';

import stylisticConfig from '../src/stylistic.config';

const configs = await stylisticConfig({
	astro: false,
	isTypeAware: true,
	json: false,
	markdown: false,
	stylistic: {
		arrowParens: 'avoid',
		braceStyle: '1tbs',
		bracketSameLine: true,
		bracketSpacing: true,
		endOfLine: 'lf',
		format: true,
		imports: true,
		indent: 'tab',
		indentSize: 4,
		perfectionist: true,
		printWidth: 120,
		quoteProps: 'as-needed',
		quotes: 'single',
		semicolons: true,
		singleAttributePerLine: true,
		trailingComma: 'es5',
		unicorn: true,
	},
	typescript: true,
});

await writeFlatConfigs(configs, 'src/typegen.d.ts');