import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';

export type IgnoreOptions = Omit<FlatGitignoreOptions, 'name'> | boolean
