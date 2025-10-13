import type { Awaitable } from '../types';

export default async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
	const resolved = await m;

	// eslint-disable-next-line typescript/no-unsafe-member-access,typescript/no-explicit-any,typescript/no-unsafe-return
	return (resolved as any).default ?? resolved;
}
