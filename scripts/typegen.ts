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

const configNames = configs.map(index => index.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(index => `'${index}'`).join(' | ')}
`;

await Bun.write('src/typegen.d.ts', dts);
