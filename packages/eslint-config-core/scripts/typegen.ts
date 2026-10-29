import { combine, writeFlatConfigs } from '@hexadrop/eslint-config-shared';
import { builtinRules } from 'eslint/use-at-your-own-risk';

import coreConfig from '../src/core.config';
import defaultCoreOptions from '../src/core.options';
import ignoreConfig from '../src/ignore.config';
import importsConfig from '../src/imports.config';

// All core sections on so ConfigNames covers every optional branch.
const options = defaultCoreOptions({
	astro: true,
	json: true,
	markdown: true,
	stylistic: true,
	typescript: true,
});

const configs = await combine(
	{
		plugins: {
			'': {
				rules: Object.fromEntries(builtinRules),
			},
		},
	},
	ignoreConfig(options),
	coreConfig(options),
	importsConfig(options)
);

await writeFlatConfigs(configs, 'src/typegen.d.ts');
