import eslintPluginUnicorn from 'eslint-plugin-unicorn';

import type { OptionsOverrides } from '../../options';
import type { TypedFlatConfigItem } from '../../types';

export default function unicorn(
	options: OptionsOverrides | boolean = true,
): TypedFlatConfigItem[] {
	if (!options) {
		return [];
	}
	const {
		overrides = {},
	} = typeof options === 'boolean' ? {} : options;

	return [
		{
			name: 'hexatool/unicorn',
			plugins: {
				// eslint-disable-next-line typescript/no-unsafe-assignment
				unicorn: eslintPluginUnicorn,
			},
			// eslint-disable-next-line typescript/no-unsafe-assignment
			rules: {
				// eslint-disable-next-line typescript/no-unsafe-member-access
				...eslintPluginUnicorn.configs['flat/recommended'].rules,
				'unicorn/prevent-abbreviations': [
					'error',
					{
						allowList: {
							ProcessEnv: true,
						},
					},
				],
				...overrides,
			},
		},
	];
}
