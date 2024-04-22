import type { OptionsOverrides, StylisticConfig } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';

export const StylisticConfigDefaults: StylisticConfig = {
	arrowParens: false,
	blockSpacing: true,
	braceStyle: '1tbs',
	commaDangle: 'always-multiline',
	indent: 'tab',
	jsx: true,
	lineLength: 120,
	quoteProps: 'as-needed',
	quotes: 'single',
	semi: true,

};

export default async function stylistic(
	stylistic: (OptionsOverrides & StylisticConfig) | false = {},
): Promise<TypedFlatConfigItem[]> {
	const {
		lineLength = 120,
		overrides = {},
		...rest
	} = {
		...StylisticConfigDefaults,
		...stylistic,
	};

	const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));
	const config = pluginStylistic.configs.customize(rest);

	return stylistic
		? [
				{
					name: 'hexatool/style/rules',
					plugins: {
						style: pluginStylistic,
					},
					rules: {
						...config.rules,
						curly: [
							'error',
							'all',
						],
						'style/array-bracket-newline': [
							'error',
							{ minItems: 2, multiline: true },
						],
						'style/array-element-newline': [
							'error',
							{ minItems: 2, multiline: true },
						],
						'style/implicit-arrow-linebreak': [
							'error',
							'beside',
						],
						'style/jsx-sort-props': 'error',
						'style/max-len': [
							'error',
							{ code: lineLength, ignoreComments: true, ignoreUrls: true },
						],
						'style/no-extra-semi': 'error',
						'style/padding-line-between-statements': [
							'error',
							{ blankLine: 'always', next: 'return', prev: '*' },
						],
						...overrides,
					},
				},
				{
					files: ['**/*.d.ts'],
					name: 'hexatool/style/disables/dts',
					rules: {
						'style/spaced-comment': 'off',
					},
				},
			]
		: [];
}
