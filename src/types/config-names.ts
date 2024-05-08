import type {
	CoreConfigNames,
	IgnoreConfigNames,
	JsonConfigNames,
	MarkdownConfigNames,
	ReactConfigNames,
	StylisticConfigNames,
	TypescriptConfigNames,
} from '../config';

export type ConfigNames =
	| CoreConfigNames
	| IgnoreConfigNames
	| JsonConfigNames
	| MarkdownConfigNames
	| ReactConfigNames
	| StylisticConfigNames
	| TypescriptConfigNames;
