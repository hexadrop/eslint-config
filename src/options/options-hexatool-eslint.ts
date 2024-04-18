import type {
	GitignoreOptions,
	JavascriptOptions,
	JsonOptions,
	PerfectionistOptions,
	TypescriptOptions,
	UnicornOptions,
} from '../config';
import type { TypedFlatConfigItem } from '../types';
import type { AutoRenamePluginsOptions } from './options-auto-rename-plugins';
import type { IsInEditorOptions } from './options-is-in-editor';
import type { StylisticOptions } from './options-stylistic';

export type HexatoolEslintOptions =
	AutoRenamePluginsOptions
	& GitignoreOptions
	& IsInEditorOptions
	& JavascriptOptions
	& JsonOptions
	& PerfectionistOptions
	& StylisticOptions
	& TypedFlatConfigItem
	& TypescriptOptions
	& UnicornOptions;
