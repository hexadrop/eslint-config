import type { TypedFlatConfigItem } from './typed-flat-config-item';

export type PickRules<T extends TypedFlatConfigItem['rules'], S extends string> = {
	[K in keyof T as K extends `${S}${string}` ? K : never]: T[K];
};
