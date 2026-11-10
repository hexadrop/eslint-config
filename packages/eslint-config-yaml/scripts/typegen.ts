import { writeFlatConfigs } from '@hexadrop/eslint-config-shared';

import yaml from '../src/yaml.config';

const configs = await yaml();

await writeFlatConfigs(configs, 'src/typegen.d.ts');
