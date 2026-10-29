import { writeFlatConfigs } from '@hexadrop/eslint-config-shared';

import typescriptConfig from '../src/typescript.config';

const configs = [...(await typescriptConfig({ project: true }))];

await writeFlatConfigs(configs, 'src/typegen.d.ts');
