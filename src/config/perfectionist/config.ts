import type { OptionsOverrides } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';

export default async function perfectionist(
	options: OptionsOverrides | boolean = true,
): Promise<TypedFlatConfigItem[]> {
	if (!options) {
		return [];
	}

	// eslint-disable-next-line typescript/no-unsafe-assignment
	const perfectionistNatural
		= await interopDefault(import('eslint-plugin-perfectionist/configs/recommended-natural'));

	const {
		overrides = {},
	} = typeof options === 'boolean' ? {} : options;

	// eslint-disable-next-line typescript/no-unsafe-return
	return [
		{
			...perfectionistNatural,
			name: 'hexatool/perfectionist/rules',
			// eslint-disable-next-line typescript/no-unsafe-assignment
			rules: {
				// eslint-disable-next-line typescript/no-unsafe-member-access
				...perfectionistNatural.rules,
				'perfectionist/sort-imports': 'off',
				'perfectionist/sort-named-exports': 'off',
				...overrides,
			},
		},
	];
}
