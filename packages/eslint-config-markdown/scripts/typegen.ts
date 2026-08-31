import { flatConfigsToRulesDTS } from 'eslint-typegen/core';

import markdown from '../src/markdown.config';

const configs = await markdown({ markdown: true });

const configNames = configs.map(index => index.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(index => `'${index}'`).join(' | ')}
`;

await Bun.write('src/typegen.d.ts', dts);
