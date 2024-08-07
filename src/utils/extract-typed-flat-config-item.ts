import type { TypedFlatConfigItem } from '../types';

const flatConfigProperties: (keyof TypedFlatConfigItem)[] = [
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

export default function extractTypedFlatConfigItem(config?: TypedFlatConfigItem): TypedFlatConfigItem | undefined {
	if (!config) {
		return undefined;
	}
	const result: TypedFlatConfigItem = {};
	for (const key of flatConfigProperties) {
		if (key in config) {
			// eslint-disable-next-line typescript/no-explicit-any,typescript/no-unsafe-assignment
			result[key] = config[key] as any;
		}
	}

	if (Object.keys(result).length === 0) {
		return undefined;
	}

	return result;
}
