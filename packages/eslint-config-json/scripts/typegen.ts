import { flatConfigsToRulesDTS } from 'eslint-typegen/core';

import json from '../src/json.config';
import JSON_SORT_KEYS_CONFIG from '../src/json.sort-keys';

const configs = [...(await json()), ...JSON_SORT_KEYS_CONFIG];

const configNames = configs.map(index => index.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(index => `'${index}'`).join(' | ')}
`;

await Bun.write('src/typegen.d.ts', dts);
