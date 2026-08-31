import { flatConfigsToRulesDTS } from 'eslint-typegen/core';

import react from '../src/react.config';

const configs = await react({ react: true, typescript: false });

const configNames = configs.map(index => index.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(index => `'${index}'`).join(' | ')}
`;

await Bun.write('src/typegen.d.ts', dts);
