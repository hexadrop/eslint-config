import { builtinRules } from 'eslint/use-at-your-own-risk';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';

import { combine } from '../src';
import { astro, core, ignore, imports, json, markdown, react, stylistic, typescript } from '../src/config';
import { defaultOptions } from '../src/options';

const options = defaultOptions();

const configs = await combine(
	{
		plugins: {
			'': {
				rules: Object.fromEntries(builtinRules.entries()),
			},
		},
	},
	ignore(options),
	core(options),
	typescript(options),
	react(options),
	astro(options),
	json(options),
	markdown(options),
	imports(options),
	stylistic(options)
);

const dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
});

await Bun.write('src/typegen.d.ts', dts);
