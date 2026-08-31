import type { TypedFlatConfigItem } from '../types/typed-flat-config-item';

const flatConfigProperties: (keyof TypedFlatConfigItem<never>)[] = [
	'name',
	'files',
	'ignores',
	'languageOptions',
	'linterOptions',
	'processor',
	'plugins',
	'rules',
	'settings',
] as const;

export default function extractTypedFlatConfigItem<RuleOptionsType>(
	config?: TypedFlatConfigItem<RuleOptionsType>
): TypedFlatConfigItem<RuleOptionsType> | undefined {
	if (!config) {
		return undefined;
	}
	const result: TypedFlatConfigItem<RuleOptionsType> = {};
	for (const key of flatConfigProperties) {
		if (Object.hasOwn(config, key)) {
			// eslint-disable-next-line typescript/no-explicit-any,typescript/no-unsafe-assignment
			result[key] = config[key] as any;
		}
	}

	if (Object.keys(result).length === 0) {
		return undefined;
	}

	return result;
}
