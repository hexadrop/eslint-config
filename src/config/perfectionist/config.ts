import perfectionistNatural from 'eslint-plugin-perfectionist/configs/recommended-natural';

import type { OptionsOverrides } from '../../options';
import type { TypedFlatConfigItem } from '../../types';

export default function perfectionist(
	options: OptionsOverrides | boolean = true,
): TypedFlatConfigItem[] {
	if (!options) {
		return [];
	}

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
