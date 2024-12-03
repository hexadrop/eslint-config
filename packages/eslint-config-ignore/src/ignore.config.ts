import interop from '@hexadrop/eslint-config-interop';
import type { HexadropEslintConfigOptions } from '@hexadrop/eslint-config-options';
import type { Linter } from 'eslint';
import { existsSync } from 'node:fs';
import {
	IGNORE_CONFIG_NAME_ADDITIONAL,
	IGNORE_CONFIG_NAME_DEFAULT,
	IGNORE_CONFIG_NAME_GITIGNORE,
} from './ignore.config-name';
import IGNORE_GLOB from './ignore.globs';

export default async function ignore({ ignore }: HexadropEslintConfigOptions): Promise<Linter.Config[]> {
	if (ignore === false) {
		return [];
	}

	const config: Linter.Config[] = [
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

	if (ignore === true) {
		if (existsSync('.gitignore')) {
			const gitignore = await interop(import('eslint-config-flat-gitignore'));

			return [...config, { ...gitignore(), name: IGNORE_CONFIG_NAME_GITIGNORE }];
		}

		return [];
	}

	const gitignore = await interop(import('eslint-config-flat-gitignore'));

	return [...config, { ...gitignore(ignore), name: IGNORE_CONFIG_NAME_GITIGNORE }];
}
