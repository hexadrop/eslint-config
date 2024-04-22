import type {
	AstroOptions,
	GitignoreOptions,
	JavascriptOptions,
	JsonOptions,
	MarkdownOptions,	PerfectionistOptions,
	ReactOptions,
	TypescriptOptions,
	UnicornOptions } from '../config';
import type { TypedFlatConfigItem } from '../types';
import type { AutoRenamePluginsOptions } from './options-auto-rename-plugins';
import type { IsInEditorOptions } from './options-is-in-editor';
import type { StylisticOptions } from './options-stylistic';

export type HexatoolEslintOptions =
	AstroOptions
	& AutoRenamePluginsOptions
	& GitignoreOptions
	& IsInEditorOptions
	& JavascriptOptions
	& JsonOptions
	& MarkdownOptions
	& PerfectionistOptions
	& ReactOptions
	& StylisticOptions
	& TypedFlatConfigItem
	& TypescriptOptions
	& UnicornOptions;
