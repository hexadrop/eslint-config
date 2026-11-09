import type { EndToEndCase as BaseEndToEndCase } from '@hexadrop/eslint-config-shared';

import type { TypedFlatConfigItem } from '../src/yaml.typed-config';

interface EndToEndCase extends BaseEndToEndCase {
	extraConfigs?: TypedFlatConfigItem[];
}

/**
 * End-to-end scenarios over real fixture files: each fixture is a dirty YAML
 * file that the config is run against with `fix` enabled. Two snapshots are
 * frozen per file: the diagnostics that survive autofix and the resulting file
 * content, which pins the formatting behavior of `eslint --fix`.
 */
export const END_TO_END_CASES: EndToEndCase[] = [
	{
		file: 'clean.yaml',
		slug: 'clean',
	},
	{
		file: 'file.yaml',
		slug: 'yaml',
	},
	{
		file: 'file.yml',
		slug: 'yml',
	},
	{
		file: 'invalid.yaml',
		slug: 'invalid',
	},
	{
		file: 'workflow.yml',
		slug: 'workflow',
	},
	{
		extraConfigs: [{ name: 'consumer/rule-override', rules: { 'yaml/no-empty-mapping-value': 'off' } }],
		file: 'rule-override.yaml',
		slug: 'rule-override',
	},
];

export type { EndToEndCase };
