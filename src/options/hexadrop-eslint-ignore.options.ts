import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';

export interface HexadropEslintIgnoreOptions extends Omit<FlatGitignoreOptions, 'name'> {
	/**
	 * Additional ignore patterns.
	 */
	globs?: string[];
}
