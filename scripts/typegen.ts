import fs from 'node:fs/promises';

import { builtinRules } from 'eslint/use-at-your-own-risk';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';

import {
	astro,
	combine, formatters,
	imports,
	javascript,
	json,
	markdown,
	node,
	perfectionist,
	react,
	stylistic,
	typescript,
	unicorn,
} from '../src';

const configs = await combine(
	{
		plugins: {
			'': {
				rules: Object.fromEntries(builtinRules.entries()),
			},
		},
	},
	astro(true),
	formatters(true),
	imports(),
	javascript(),
	json(),
	markdown(),
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
