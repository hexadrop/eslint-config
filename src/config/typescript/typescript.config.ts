import { isPackageExists } from 'local-pkg';

import type { TypedFlatConfigItem } from '../../types';
import { interopDefault, toArray } from '../../utils';
import { SOURCE_GLOBS } from '../core';
import TYPESCRIPT_GLOBS from './typescript.globs';
import type { TypescriptOptions } from './typescript.options';
import typescriptParser from './typescript.parser';
import getCwdTsconfigPath from './typescript.tsconfig';


const TYPESCRIPT_CONFIG_NAME = 'hexatool/typescript';

export default async function typescript(
	options: TypescriptOptions = isPackageExists('typescript'),
): Promise<TypedFlatConfigItem[]> {
	if (options === false) {
		return [];
	}

	const {
		tsconfigPath = getCwdTsconfigPath(),
	} = typeof options === 'object' ? options : {};

	const [
		plugin,
		parser,
	] = await Promise.all([
		interopDefault(import('@typescript-eslint/eslint-plugin')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	const config: TypedFlatConfigItem[] = [];

	// Install the plugins without globs, so they can be configured separately.
	config.push({
		name: `${TYPESCRIPT_CONFIG_NAME}/setup`,
		plugins: {
			typescript: plugin,
		},
	});

	if (tsconfigPath && tsconfigPath.length > 0) {
		config.push(
			typescriptParser({
				parser,
				files: TYPESCRIPT_GLOBS,
				tsconfigPath: toArray(tsconfigPath),
			}),
			typescriptParser({
				parser,
				files: SOURCE_GLOBS,
				ignores: TYPESCRIPT_GLOBS,
			}),
		);
	} else {
		config.push(
			typescriptParser({
				parser,
				files: SOURCE_GLOBS,
			}),
		);
	}


	return config;
}
