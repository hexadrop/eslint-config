import perfectionistNatural from 'eslint-plugin-perfectionist/configs/recommended-natural';

import type { TypedFlatConfigItem } from '../../types';

export default function perfectionist(
	options = true,
): TypedFlatConfigItem[] {
	if (!options) {
		return [];
	}

	// eslint-disable-next-line typescript/no-unsafe-return
	return [
		{

			...perfectionistNatural,
			name: 'hexatool/perfectionist',
			rules: {
				'perfectionist/sort-imports': 'off',
			},
		},
	];
}
