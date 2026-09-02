import type { TypedFlatConfigItem } from '../types';

const flatConfigProperties: (keyof TypedFlatConfigItem<unknown>)[] = [
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

export default function extractTypedFlatConfigItem<Options>(
	config?: TypedFlatConfigItem<Options>
): TypedFlatConfigItem<Options> | undefined {
	if (!config) {
		return undefined;
	}
	const result: TypedFlatConfigItem<Options> = {};
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
