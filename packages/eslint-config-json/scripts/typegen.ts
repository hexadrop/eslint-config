import { writeFlatConfigs } from '@hexadrop/eslint-config-shared';

import json from '../src/json.config';
import JSON_SORT_KEYS_CONFIG from '../src/json.sort-keys';

const configs = [...(await json()), ...JSON_SORT_KEYS_CONFIG];

await writeFlatConfigs(configs, 'src/typegen.d.ts');
