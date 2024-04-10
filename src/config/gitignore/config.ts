import fs from 'node:fs';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import type { GitignoreOptions } from './options';

export default async function gitignore(
	options: GitignoreOptions['gitignore'] = true,
): Promise<TypedFlatConfigItem[]> {

	if (options) {
		if (typeof options === 'boolean') {
			const gitignoreFlatConfig = await interopDefault(import('eslint-config-flat-gitignore'));
			if (fs.existsSync('.gitignore'))
				return [gitignoreFlatConfig()];
		} else {
			const gitignoreFlatConfig = await interopDefault(import('eslint-config-flat-gitignore'));
			return [gitignoreFlatConfig(options)];
		}
	}

	return [

	];
}
