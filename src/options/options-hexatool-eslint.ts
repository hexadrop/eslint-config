import type { GitignoreOptions, JavascriptOptions } from '../config';
import type { AutoRenamePluginsOptions } from './options-auto-rename-plugins';
import type { IsInEditorOptions } from './options-is-in-editor';
import type { TypedFlatConfigItem } from '../types';

export type HexatoolEslintOptions =
	JavascriptOptions
	& IsInEditorOptions
	& TypedFlatConfigItem
	& AutoRenamePluginsOptions
	& GitignoreOptions;
