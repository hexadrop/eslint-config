import { writeFlatConfigs } from '@hexadrop/eslint-config-shared';

import markdown from '../src/markdown.config';

const configs = await markdown();

await writeFlatConfigs(configs, 'src/typegen.d.ts');
