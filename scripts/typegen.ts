import { builtinRules } from 'eslint/use-at-your-own-risk';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';

import { javascript } from '../src/config';
import { combine } from '../src/utils';

const configs = await combine(
	{
		plugins: {
			'': {
				rules: Object.fromEntries(builtinRules.entries()),
			},
		},
	},
	javascript(),
);

const dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
});

await Bun.write('src/typegen.d.ts', dts);
