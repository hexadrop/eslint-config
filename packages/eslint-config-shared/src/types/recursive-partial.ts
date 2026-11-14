export type RecursivePartial<T> = {
	// eslint-disable-next-line typescript/no-generated-empty-object-type
	[P in keyof T]?: RecursivePartial<T[P]>;
};
