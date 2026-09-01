import { flatConfigsToRulesDTS } from 'eslint-typegen/core';

import typescript from '../src/typescript.config';

const configs = await typescript({ typescript: 'tsconfig.json' });

const configNames = configs.map(index => index.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(index => `'${index}'`).join(' | ')}
`;

await Bun.write('src/typegen.d.ts', dts);
