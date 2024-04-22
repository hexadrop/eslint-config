import type { OptionsOverrides } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';

export default async function unicorn(
	options: OptionsOverrides | boolean = true,
): Promise<TypedFlatConfigItem[]> {
	if (!options) {
		return [];
	}
	const {
		overrides = {},
	} = typeof options === 'boolean' ? {} : options;

	// eslint-disable-next-line typescript/no-unsafe-assignment
	const eslintPluginUnicorn = await interopDefault(import('eslint-plugin-unicorn'));

	return [
		{
			name: 'hexatool/unicorn/rules',
			plugins: {
				// eslint-disable-next-line typescript/no-unsafe-assignment
				unicorn: eslintPluginUnicorn,
			},
			// eslint-disable-next-line typescript/no-unsafe-assignment
			rules: {
				// eslint-disable-next-line typescript/no-unsafe-member-access
				...eslintPluginUnicorn.configs['flat/recommended'].rules,
				'unicorn/no-array-reduce': 'off',
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
