export type ResolvedOptions<T> = T extends boolean
	? never
	: NonNullable<T>
