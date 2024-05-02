import type { TypedFlatConfigItem } from './typed-flat-config-item';

export type PickRules<T extends TypedFlatConfigItem['rules'], S extends string> = {
	[K in keyof T as K extends `${S}${infer _R}` ? K : never]: T[K]
}
