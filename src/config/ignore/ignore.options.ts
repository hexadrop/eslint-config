import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';

// TODO: Remove this
interface IgnoreOptionsObject extends Omit<FlatGitignoreOptions, 'name'> {
	/**
	 * Additional ignore patterns.
	 */
	ignore?: string[];
}

export type IgnoreOptions = IgnoreOptionsObject | boolean;
