import fs from 'node:fs';

import { interopDefault } from '@hexadrop/eslint-config-shared';

import {
	IGNORE_CONFIG_NAME_ADDITIONAL,
	IGNORE_CONFIG_NAME_DEFAULT,
	IGNORE_CONFIG_NAME_GITIGNORE,
} from './config-names';
import type { CoreOptions } from './core.options';
import type { TypedFlatConfigItem } from './core.typed-config';
import { IGNORE_GLOB } from './globs';

export default async function ignore({ ignore }: CoreOptions): Promise<TypedFlatConfigItem[]> {
	if (ignore === false) {
		return [];
	}

	const config: TypedFlatConfigItem[] = [
		{
			ignores: IGNORE_GLOB,
			name: IGNORE_CONFIG_NAME_DEFAULT,
		},
	];

	if (typeof ignore === 'object' && ignore.globs) {
		config.push({
			ignores: ignore.globs,
			name: IGNORE_CONFIG_NAME_ADDITIONAL,
		});
	}

	if (typeof ignore === 'boolean') {
		if (fs.existsSync('.gitignore')) {
			const gitignore = await interopDefault(import('eslint-config-flat-gitignore'));

			return [...config, { ...gitignore(), name: IGNORE_CONFIG_NAME_GITIGNORE }];
		}

		return [];
	}

	const gitignore = await interopDefault(import('eslint-config-flat-gitignore'));

	return [...config, { ...gitignore(ignore), name: IGNORE_CONFIG_NAME_GITIGNORE }];
}
