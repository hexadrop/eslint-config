import type { Linter } from 'eslint';

/**
 * Rename plugin prefixes in a rule object.
 * Accepts a map of prefixes to rename.
 *
 * @example
 * ```ts
 * import { renameRules } from '@hexatool/eslint-config'
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
export default function renameRules(rules: Linter.RulesRecord, map: Record<string, string>): Linter.RulesRecord {
	if (Object.keys(map).length === 0) {
		return rules;
	}
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
