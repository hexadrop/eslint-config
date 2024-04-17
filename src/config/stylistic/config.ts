import type { OptionsOverrides, StylisticConfig } from '../../options';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';

const StylisticConfigDefaults: StylisticConfig = {
	indent: 'tab',
	jsx: true,
	quotes: 'single',
	semi: true,
	commaDangle: 'always-multiline',
	arrowParens: false,
	blockSpacing: true,
	braceStyle: '1tbs',
	quoteProps: 'as-needed',
	lineLength: 120,

};

export default async function stylistic(
	stylistic: false | (StylisticConfig & OptionsOverrides),
): Promise<TypedFlatConfigItem[]> {
	const {
		overrides = {},
		lineLength,
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
					name: 'hexatool/stylistic/rules',
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
							{ multiline: true, minItems: 2 },
						],
						'style/array-element-newline': [
							'error',
							{ multiline: true, minItems: 2 },
						],
						'style/implicit-arrow-linebreak': [
							'error',
							'beside',
						],
						'style/jsx-sort-props': 'error',
						'style/max-len': [
							'error',
							{ code: lineLength, ignoreUrls: true },
						],
						'style/no-extra-semi': 'error',
						'style/padding-line-between-statements': [
							'error',
							{ blankLine: 'always', prev: '*', next: 'return' },
						],
						...overrides,
					},
				},
				{
					files: ['**/*.d.ts'],
					name: 'hexatool/stylistic/disables/dts',
					rules: {
						'style/spaced-comment': 'off',
					},
				},
			]
		: [];
}
