import type { GitignoreOptions, JavascriptOptions, JsonOptions, TypescriptOptions } from '../config';
import type { TypedFlatConfigItem } from '../types';
import type { AutoRenamePluginsOptions } from './options-auto-rename-plugins';
import type { IsInEditorOptions } from './options-is-in-editor';
import type { StylisticOptions } from './options-stylistic';

export type HexatoolEslintOptions =
	JavascriptOptions
	& TypescriptOptions
	& IsInEditorOptions
	& TypedFlatConfigItem
	& AutoRenamePluginsOptions
	& GitignoreOptions
	& StylisticOptions
	& JsonOptions;
