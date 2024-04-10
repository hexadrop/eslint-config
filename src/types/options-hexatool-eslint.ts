import type { JavascriptOptions } from '../config/javascript';
import type { AutoRenamePluginsOptions } from './options-auto-rename-plugins';
import type { IsInEditorOptions } from './options-is-in-editor';
import type { TypedFlatConfigItem } from './typed-flat-config-item';

export type HexatoolEslintOptions = JavascriptOptions & IsInEditorOptions & TypedFlatConfigItem & AutoRenamePluginsOptions;
