import fs from 'node:fs/promises';

import { builtinRules } from 'eslint/use-at-your-own-risk';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';

import { astro, combine, imports, javascript, json, node, perfectionist, react, stylistic, typescript, unicorn } from '../src';

const configs = await combine(
	{
		plugins: {
			'': {
				rules: Object.fromEntries(builtinRules.entries()),
			},
		},
	},
	astro(true),
	imports(),
	javascript(),
	json(),
	node(),
	perfectionist(),
	react(true),
	stylistic(),
	typescript(),
	unicorn(),
);

const dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
});

await fs.writeFile('src/typegen.d.ts', dts);
