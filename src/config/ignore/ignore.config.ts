import fs from 'node:fs';

import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import {
	IGNORE_CONFIG_NAME_ADDITIONAL,
	IGNORE_CONFIG_NAME_DEFAULT,
	IGNORE_CONFIG_NAME_GITIGNORE,
} from './ignore.config-name';
import IGNORE_GLOB from './ignore.globs';
import type { IgnoreOptions } from './ignore.options';

export default async function ignore(options: IgnoreOptions = true): Promise<TypedFlatConfigItem[]> {
	if (options === false) {
		return [];
	}

	const config: TypedFlatConfigItem[] = [
		{
			ignores: IGNORE_GLOB,
			name: IGNORE_CONFIG_NAME_DEFAULT,
		},
	];

	if (typeof options === 'object' && options.ignore) {
		config.push({
			ignores: options.ignore,
			name: IGNORE_CONFIG_NAME_ADDITIONAL,
		});
	}

	if (typeof options === 'boolean') {
		if (fs.existsSync('.gitignore')) {
			const gitignore = await interopDefault(import('eslint-config-flat-gitignore'));

			return [...config, { ...gitignore(), name: IGNORE_CONFIG_NAME_GITIGNORE }];
		}

		return [];
	}

	const gitignore = await interopDefault(import('eslint-config-flat-gitignore'));

	return [...config, { ...gitignore(options), name: IGNORE_CONFIG_NAME_GITIGNORE }];
}
