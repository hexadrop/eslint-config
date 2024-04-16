import type { GitignoreOptions, JavascriptOptions } from '../config';
import type { TypescriptOptions } from '../config/typescript';
import type { AutoRenamePluginsOptions } from './options-auto-rename-plugins';
import type { IsInEditorOptions } from './options-is-in-editor';
import type { TypedFlatConfigItem } from '../types';

export type HexatoolEslintOptions =
	JavascriptOptions
	& TypescriptOptions
	& IsInEditorOptions
	& TypedFlatConfigItem
	& AutoRenamePluginsOptions
	& GitignoreOptions;
