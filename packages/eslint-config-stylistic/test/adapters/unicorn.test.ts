import {
	GLOB_MARKDOWN,
	GLOB_MARKDOWN_ASTRO,
	GLOB_MARKDOWN_JSON,
	GLOB_MARKDOWN_SOURCE,
} from '@hexadrop/eslint-config-core';
import { describe, expect, test } from 'bun:test';

import { config } from '../../src';
import { configOptions } from '../helpers';

describe('unicorn adapter', () => {
	test('emits the unicorn rules with the hexadrop overrides', async () => {
		const configs = await config(configOptions({ unicorn: true }));
		const rules = configs.find(c => c.name === 'hexadrop/stylistic/rules/unicorn')?.rules;

		expect(rules?.['unicorn/no-array-reduce']).toBe('off');
		expect(rules?.['unicorn/consistent-class-member-order']).toBe('off');
		expect(rules?.['unicorn/name-replacements']).toBeDefined();
	});

	test('adds the markdown filename exceptions when markdown is enabled', async () => {
		const configs = await config(configOptions({ astro: true, json: true, markdown: true, unicorn: true }));
		const markdownRules = configs.find(c => c.name === 'hexadrop/stylistic/rules/unicorn/markdown');
		const markdownSourceRules = configs.find(c => c.name === 'hexadrop/stylistic/rules/unicorn/markdown/source');

		expect(markdownRules?.files).toEqual(GLOB_MARKDOWN);
		expect(markdownSourceRules?.files).toEqual([
			...GLOB_MARKDOWN_SOURCE,
			...GLOB_MARKDOWN_JSON,
			...GLOB_MARKDOWN_ASTRO,
		]);
		expect(markdownRules?.rules?.['unicorn/filename-case']).toBe('off');
	});

	test('does not add markdown exceptions when markdown is disabled', async () => {
		const configs = await config(configOptions({ unicorn: true }));
		const names = configs.map(c => c.name);

		expect(names).not.toContain('hexadrop/stylistic/rules/unicorn/markdown');
	});

	test('emits no unicorn items when the concern is disabled', async () => {
		const configs = await config(configOptions());
		const names = configs.map(c => c.name);

		expect(names).not.toContain('hexadrop/stylistic/rules/unicorn');
	});
});
