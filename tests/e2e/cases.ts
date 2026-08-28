import type { HexadropEslintOptions } from '../../src/options';
import type { RecursivePartial, TypedFlatConfigItem } from '../../src/types';

export interface EndToEndCase {
	extraConfigs?: TypedFlatConfigItem[];
	fixture: string;
	options?: RecursivePartial<HexadropEslintOptions>;
	slug: string;
}

/**
 * End-to-end scenarios: each case lints a real fixture file with the real
 * eslint engine and freezes the reported diagnostics. Unlike the golden
 * config snapshots, these catch behavior changes introduced by dependency
 * updates (rule renames, severity flips, new detections).
 */
export const END_TO_END_CASES: EndToEndCase[] = [
	{
		fixture: 'case-clean',
		options: { astro: false, react: false, typescript: true },
		slug: 'case-clean',
	},
	{
		extraConfigs: [{ name: 'consumer/rule-override', rules: { quotes: ['error', 'double'] } }],
		fixture: 'case-rule-override',
		options: { astro: false, react: false, typescript: true },
		slug: 'case-rule-override',
	},
	{
		fixture: 'case-dirty-no-console',
		options: { astro: false, react: false, typescript: true },
		slug: 'case-dirty-no-console',
	},
];
