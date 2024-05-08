import type {
	CoreConfigNames,
	IgnoreConfigNames,
	MarkdownConfigNames,
	StylisticConfigNames,
	TypescriptConfigNames,
} from '../config';

export type ConfigNames =
	| CoreConfigNames
	| IgnoreConfigNames
	| MarkdownConfigNames
	| StylisticConfigNames
	| TypescriptConfigNames;
