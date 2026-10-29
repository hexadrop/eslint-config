import { GLOB_MARKDOWN_JSON } from '@hexadrop/eslint-config-shared';
import { describe, expect, test } from 'bun:test';

import { config } from '../../src';
import { configOptions, formatting, hasFiles } from '../helpers';

describe('json adapter', () => {
	test('emits the json rules and the sort-keys slice', async () => {
		const configs = await config(configOptions({ json: true }));
		const names = configs.map(c => c.name);

		expect(names).toContain('hexadrop/stylistic/rules/json');
		expect(names).toContain('hexadrop/stylistic/rules/json/package.json');
		expect(names).toContain('hexadrop/stylistic/rules/json/tsconfig.json');
	});

	test('uses the configured indentation', async () => {
		const tabbed = await config(configOptions({ json: true }));
		const spaced = await config(
			configOptions({ json: true, stylistic: { ...formatting, indent: 'space', indentSize: 2 } })
		);

		expect(tabbed.find(c => c.name === 'hexadrop/stylistic/rules/json')?.rules?.['json/indent']).toEqual([
			'error',
			'tab',
		]);
		expect(spaced.find(c => c.name === 'hexadrop/stylistic/rules/json')?.rules?.['json/indent']).toEqual([
			'error',
			2,
		]);
	});

	test('adds the 2-space markdown json override for json code blocks', async () => {
		const configs = await config(configOptions({ json: true }));
		const markdownJson = configs.findLast(
			c => hasFiles(c, GLOB_MARKDOWN_JSON) && c.rules?.['json/indent'] !== undefined
		);

		expect(markdownJson?.rules?.['json/indent']).toEqual(['error', 2]);
	});
});
