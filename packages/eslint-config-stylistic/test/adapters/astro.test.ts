import { GLOB_MARKDOWN_ASTRO } from '@hexadrop/eslint-config-core';
import { describe, expect, test } from 'bun:test';

import { config } from '../../src';
import { configOptions, hasFiles } from '../helpers';

describe('astro adapter', () => {
	test('emits the astro stylistic rules', async () => {
		const configs = await config(configOptions({ astro: true }));
		const astroRules = configs.find(c => c.name === 'hexadrop/stylistic/rules/astro');

		expect(astroRules).toBeDefined();
		expect(astroRules?.rules?.['astro/semi']).toBe('error');
		expect(astroRules?.rules?.['astro/prefer-class-list-directive']).toBe('error');
	});

	test('adds the 2-space markdown astro override when markdown is enabled', async () => {
		const configs = await config(configOptions({ astro: true, markdown: true }));
		const markdownAstro = configs.findLast(
			c => hasFiles(c, GLOB_MARKDOWN_ASTRO) && c.rules?.['style/indent'] !== undefined
		);

		expect(markdownAstro?.rules?.['style/indent']).toEqual(['error', 2]);
	});

	test('emits no astro items when the concern is disabled', async () => {
		const configs = await config(configOptions());
		const names = configs.map(c => c.name);

		expect(names).not.toContain('hexadrop/stylistic/rules/astro');
	});
});
