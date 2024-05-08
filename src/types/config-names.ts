import type {
	CoreConfigNames,
	IgnoreConfigNames,
	JsonConfigNames,
	MarkdownConfigNames,
	StylisticConfigNames,
	TypescriptConfigNames,
} from '../config';

export type ConfigNames =
	| CoreConfigNames
	| IgnoreConfigNames
	| JsonConfigNames
	| MarkdownConfigNames
	| StylisticConfigNames
	| TypescriptConfigNames;
