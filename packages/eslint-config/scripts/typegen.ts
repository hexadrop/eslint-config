import { config as json } from '@hexadrop/eslint-config-json';
import { config as markdown } from '@hexadrop/eslint-config-markdown';
import { config as react } from '@hexadrop/eslint-config-react';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';

import { combine } from '../src';
import { astro, core, ignore, imports, stylistic, typescript } from '../src/config';
import { defaultOptions } from '../src/options';

const options = defaultOptions();

const configs = await combine(
	{
		plugins: {
			'': {
				rules: Object.fromEntries(builtinRules),
			},
		},
	},
	ignore(options),
	core(options),
	typescript(options),
	react({ typescript: Boolean(options.typescript) }),
	astro(options),
	json(),
	markdown(),
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
