import type { HexadropEslintConfigOptions } from '@hexadrop/eslint-config-options';
import type { Nullable } from '@hexadrop/types/nullable';
import type { RecursivePartial } from '@hexadrop/types/recursive-partial';
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';

interface HexadropEslintIgnoreOptionsObject extends Omit<FlatGitignoreOptions, 'name'> {
	/**
	 * Additional ignore patterns.
	 */
	globs?: string[];
}

type HexadropEslintIgnoreOptions = boolean | HexadropEslintIgnoreOptionsObject;

function defaultOptions(options?: Nullable<RecursivePartial<HexadropEslintConfigOptions>>): HexadropEslintIgnoreOptions {
	const ignore = options?.ignore;
	if (typeof ignore === 'object' && ignore !== null) {
		if ('name' in ignore) {
			delete ignore.name;
		}

		return {
			...ignore,
			files:
				typeof ignore.files === 'string'
					? ignore.files === '' ? [] : [ignore.files]
					: (ignore.files?.filter(Boolean) as Nullable<string[]>) ?? [],
			globs: (ignore.globs?.filter(Boolean) as Nullable<string[]>) ?? [],
		}
	}

	return ignore ?? true;
}

export type { HexadropEslintIgnoreOptions };

export default defaultOptions;
