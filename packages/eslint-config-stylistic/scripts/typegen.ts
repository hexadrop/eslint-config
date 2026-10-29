import { writeFlatConfigs } from '@hexadrop/eslint-config-shared';

import stylisticConfig from '../src/stylistic.config';

/*
 * Resolve every optional section so the generated `ConfigNames` union covers
 * the whole peer matrix, not just the sections enabled by default.
 */
const configs = await stylisticConfig({
	astro: true,
	isTypeAware: true,
	json: true,
	markdown: true,
	stylistic: {
		arrowParens: 'avoid',
		braceStyle: '1tbs',
		bracketSameLine: true,
		bracketSpacing: true,
		endOfLine: 'lf',
		format: true,
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
