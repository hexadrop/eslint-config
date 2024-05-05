import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';

export type IgnoreOptions =
	| (Omit<FlatGitignoreOptions, 'name'> & {
			/**
			 * Additional ignore patterns.
			 */
			ignore?: string[];
	  })
	| boolean;
