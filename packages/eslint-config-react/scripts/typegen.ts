import { writeFlatConfigs } from '@hexadrop/eslint-config-shared';

import config from '../src/react.config';

const configs = await config();

await writeFlatConfigs(configs, 'src/typegen.d.ts');
