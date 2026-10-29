import { GLOB_MARKDOWN_ASTRO, GLOB_MARKDOWN_JSON, GLOB_MARKDOWN_SOURCE } from '@hexadrop/eslint-config-core';
import { describe, expect, test } from 'bun:test';

import { config } from '../../src';
import { configOptions } from '../helpers';

const SETUP = 'hexadrop/stylistic/setup';
const RULES = 'hexadrop/stylistic/rules';

describe('base adapter', () => {
	test('emits the setup and base rules items', async () => {
		const configs = await config(configOptions());

		expect(configs.map(c => c.name)).toEqual([SETUP, RULES]);
	});

	test('registers the @stylistic plugin and nothing else by default', async () => {
		const configs = await config(configOptions());
		const setup = configs.find(c => c.name === SETUP);

		expect(Object.keys(setup?.plugins ?? {})).toEqual(['style']);
	});

	test('registers the optional plugins in the setup item', async () => {
		const configs = await config(configOptions({ format: true, perfectionist: true, unicorn: true }));
		const setup = configs.find(c => c.name === SETUP);

		expect(Object.keys(setup?.plugins ?? {})).toEqual(['style', 'unicorn', 'perfectionist', 'format']);
	});

	test('applies the shared stylistic ruleset', async () => {
		const configs = await config(configOptions());
		const rules = configs.find(c => c.name === RULES)?.rules;

		expect(rules?.['curly']).toEqual(['error', 'all']);
		expect(rules?.['style/arrow-parens']).toEqual(['error', 'as-needed']);
		expect(rules?.['style/jsx-quotes']).toEqual(['error', 'prefer-single']);
		expect(rules?.['style/padding-line-between-statements']).toEqual([
			'error',
			{ blankLine: 'always', next: 'return', prev: '*' },
		]);
	});

	test('turns operator-linebreak off when formatting is enabled', async () => {
		const withoutFormat = await config(configOptions());
		const withFormat = await config(configOptions({ format: true }));

		expect(withoutFormat.find(c => c.name === RULES)?.rules?.['style/operator-linebreak']).not.toBe('off');
		expect(withFormat.find(c => c.name === RULES)?.rules?.['style/operator-linebreak']).toBe('off');
	});

	test('adds the markdown source overrides for the enabled code-block flavours', async () => {
		const configs = await config(configOptions({ astro: true, json: true, markdown: true }));
		const markdownSource = configs.find(c => c.name === 'hexadrop/stylistic/rules/markdown/source');

		expect(markdownSource?.files).toEqual([...GLOB_MARKDOWN_SOURCE, ...GLOB_MARKDOWN_JSON, ...GLOB_MARKDOWN_ASTRO]);
		expect(markdownSource?.rules?.['style/indent']).toEqual(['error', 2]);
	});

	test('does not add markdown overrides when markdown is disabled', async () => {
		const configs = await config(configOptions());

		expect(configs.map(c => c.name)).not.toContain('hexadrop/stylistic/rules/markdown/source');
	});
});
