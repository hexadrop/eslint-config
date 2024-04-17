/**
 * Rename plugin prefixes in a rule object.
 * Accepts a map of prefixes to rename.
 *
 * @example
 * ```ts
 * import { renameRules } from '@antfu/eslint-config'
 *
 * export default [{
 *   rules: renameRules(
 *     {
 *       '@typescript-eslint/indent': 'error'
 *     },
 *     { '@typescript-eslint': 'ts' }
 *   )
 * }]
 * ```
 */
// eslint-disable-next-line typescript/no-explicit-any
export default function renameRules(rules: Record<string, any>, map: Record<string, string>): Record<string, any> {
	return Object.fromEntries(
		Object.entries(rules)
			.map(([
				key,
				value,
			]) => {
				for (const [
					from,
					to,
				] of Object.entries(map)) {
					if (key.startsWith(`${from}/`)) {
						return [
							to + key.slice(from.length),
							value,
						];
					}
				}

				return [
					key,
					value,
				];
			}),
	);
}
