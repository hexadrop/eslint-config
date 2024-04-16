import fs from 'node:fs';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import GLOB_EXCLUDE from './globs';
import type { GitignoreOptions } from './options';

export default async function gitignore(
	options: GitignoreOptions['gitignore'] = true,
): Promise<TypedFlatConfigItem[]> {
	if (!options) {return [];}

	const ignores = {
		ignores: GLOB_EXCLUDE,
		name: 'hexatool/ignore',
	};
	
	if (typeof options === 'boolean') {
		const gitignoreFlatConfig = await interopDefault(import('eslint-config-flat-gitignore'));
		if (fs.existsSync('.gitignore')) {
			return [ignores, { ...gitignoreFlatConfig(), name: 'hexatool/ignore/gitignore' }];
		}
 
			return [];
		
	}


	const gitignoreFlatConfig = await interopDefault(import('eslint-config-flat-gitignore'));

	return [ignores, { ...gitignoreFlatConfig(options), name: 'hexatool/ignore/gitignore' }];
}
