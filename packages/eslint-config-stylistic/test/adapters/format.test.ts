import {
	GLOB_ASTRO,
	GLOB_MARKDOWN_ASTRO,
	GLOB_MARKDOWN_SOURCE,
	JAVASCRIPT_GLOBS,
	SOURCE_GLOBS,
} from '@hexadrop/eslint-config-core';
import { describe, expect, test } from 'bun:test';

import { config } from '../../src';
import { configOptions } from '../helpers';

type PrettierRule = [string, Record<string, unknown>];

function prettierRule(configs: Awaited<ReturnType<typeof config>>, name: string): PrettierRule | undefined {
	return configs.find(c => c.name === name)?.rules?.['format/prettier'] as PrettierRule | undefined;
}

describe('format adapter', () => {
	test('emits the prettier rule with the configured formatting options', async () => {
		const configs = await config(configOptions({ format: true }));
		const item = configs.find(c => c.name === 'hexadrop/stylistic/rules/prettier');
		const rule = prettierRule(configs, 'hexadrop/stylistic/rules/prettier');

		expect(item?.files).toEqual(JAVASCRIPT_GLOBS);
		expect(rule?.[1]['parser']).toBe('typescript');
		expect(rule?.[1]['singleQuote']).toBe(true);
		expect(rule?.[1]['useTabs']).toBe(true);
		expect(rule?.[1]['semi']).toBe(true);
	});

	test('targets the typescript source globs when typescript is enabled', async () => {
		const configs = await config(configOptions({ format: true, typescript: true }));
		const item = configs.find(c => c.name === 'hexadrop/stylistic/rules/prettier');

		expect(item?.files).toEqual(SOURCE_GLOBS);
	});

	test('adds the astro variant with the prettier astro plugin', async () => {
		const configs = await config(configOptions({ astro: true, format: true }));
		const rule = prettierRule(configs, 'hexadrop/stylistic/rules/prettier/astro');

		expect(configs.find(c => c.name === 'hexadrop/stylistic/rules/prettier/astro')?.files).toEqual(GLOB_ASTRO);
		expect(rule?.[1]['parser']).toBe('astro');
		expect(rule?.[1]['plugins']).toEqual(['prettier-plugin-astro']);
	});

	test('adds the 2-space markdown variants when markdown is enabled', async () => {
		const configs = await config(configOptions({ astro: true, format: true, markdown: true }));
		const markdownSource = prettierRule(configs, 'hexadrop/stylistic/rules/prettier/markdown/source');
		const markdownAstro = prettierRule(configs, 'hexadrop/stylistic/rules/prettier/markdown/astro');

		expect(configs.find(c => c.name === 'hexadrop/stylistic/rules/prettier/markdown/source')?.files).toEqual(
			GLOB_MARKDOWN_SOURCE
		);
		expect(markdownSource?.[1]['tabWidth']).toBe(2);
		expect(markdownSource?.[1]['useTabs']).toBe(false);
		expect(configs.find(c => c.name === 'hexadrop/stylistic/rules/prettier/markdown/astro')?.files).toEqual(
			GLOB_MARKDOWN_ASTRO
		);
		expect(markdownAstro?.[1]['plugins']).toEqual(['prettier-plugin-astro']);
		expect(markdownAstro?.[1]['tabWidth']).toBe(2);
	});

	test('emits no prettier items when the concern is disabled', async () => {
		const configs = await config(configOptions());
		const names = configs.map(c => c.name);

		expect(names).not.toContain('hexadrop/stylistic/rules/prettier');
	});
});
