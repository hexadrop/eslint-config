import fs from 'node:fs/promises';

import { builtinRules } from 'eslint/use-at-your-own-risk';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';

import {
	combine,
} from '../src';

const configs = await combine(
	{
		plugins: {
			'': {
				rules: Object.fromEntries(builtinRules.entries()),
			},
		},
	},
);

const dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
});

await fs.writeFile('src/typegen.d.ts', dts);
