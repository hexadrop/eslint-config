import type { TypedFlatConfigItem } from '../src/json.typed-config';

interface EndToEndCase {
	extraConfigs?: TypedFlatConfigItem[];
	/**
	 * Dirty fixture file at e2e/fixtures/<file>. The file name is part of
	 * the behavior under test: `package.json` and `tsconfig.json` activate
	 * the filename-scoped canonical key ordering rules.
	 */
	file: string;
	slug: string;
}

/**
 * End-to-end scenarios over real fixture files, mirroring the strategy of
 * packages/eslint-config (in turn following antfu/eslint-config): each
 * fixture is a dirty json file that the config is run against with `fix`
 * enabled. Two snapshots are frozen per file: the diagnostics that survive
 * autofix (unfixable rules such as json/no-bigint-literals) and the
 * resulting file content, which pins the formatting and key-ordering
 * behavior of `eslint --fix` against regressions.
 */
export const END_TO_END_CASES: EndToEndCase[] = [
	{
		file: 'clean.json',
		slug: 'clean',
	},
	{
		file: 'file.json',
		slug: 'json',
	},
	{
		file: 'file.jsonc',
		slug: 'jsonc',
	},
	{
		file: 'file.json5',
		slug: 'json5',
	},
	{
		file: 'invalid.json',
		slug: 'invalid',
	},
	{
		file: 'package.json',
		slug: 'package-json',
	},
	{
		file: 'tsconfig.json',
		slug: 'tsconfig-json',
	},
	{
		extraConfigs: [{ name: 'consumer/rule-override', rules: { 'json/no-dupe-keys': 'off' } }],
		file: 'rule-override.json',
		slug: 'rule-override',
	},
];

export type { EndToEndCase };
