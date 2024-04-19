import fs from 'node:fs/promises';

import { builtinRules } from 'eslint/use-at-your-own-risk';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';

import { imports, javascript, json, node, perfectionist, stylistic, unicorn } from '../src/config';
import { combine } from '../src/utils';

const configs = await combine(
	{
		plugins: {
			'': {
				rules: Object.fromEntries(builtinRules.entries()),
			},
		},
	},
	imports(),
	javascript(),
	json(),
	node(),
	perfectionist(),
	stylistic(),
	unicorn(),
);

const dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
});

await fs.writeFile('src/typegen.d.ts', dts);
