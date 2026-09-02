import {
	GLOB_MARKDOWN,
	GLOB_MARKDOWN_IN_MARKDOWN,
	MARKDOWN_CONFIG_NAME_SETUP,
	MARKDOWN_CONFIG_NAME_SETUP_PARSER,
	MARKDOWN_CONFIG_NAME_SETUP_PROCESSOR,
} from '@hexadrop/eslint-config-shared';
import { describe, expect, test } from 'bun:test';

import markdown from '../src';

describe('markdown factory', () => {
	test('returns a thenable composer resolving to the markdown config slice', async () => {
		const configs = await markdown();

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBeGreaterThanOrEqual(3);
	});

	test('emits the setup, processor and parser config names', async () => {
		const configs = await markdown();
		const names = configs.map(config => config.name);

		expect(names).toContain(MARKDOWN_CONFIG_NAME_SETUP);
		expect(names).toContain(MARKDOWN_CONFIG_NAME_SETUP_PROCESSOR);
		expect(names).toContain(MARKDOWN_CONFIG_NAME_SETUP_PARSER);
	});

	test('registers the @eslint/markdown plugin under the `markdown` prefix', async () => {
		const configs = await markdown();
		const setup = configs.find(config => config.name === MARKDOWN_CONFIG_NAME_SETUP);

		expect(setup?.plugins?.['markdown']).toBeDefined();
	});

	test('merges the markdown processor with a pass-through processor on the markdown globs', async () => {
		const configs = await markdown();
		const processor = configs.find(config => config.name === MARKDOWN_CONFIG_NAME_SETUP_PROCESSOR);
		const merged = processor?.processor;

		expect(processor?.files).toEqual(GLOB_MARKDOWN);
		expect(processor?.ignores).toEqual(GLOB_MARKDOWN_IN_MARKDOWN);
		if (typeof merged === 'string' || !merged) {
			throw new TypeError('expected a merged processor object');
		}

		expect(typeof merged.preprocess).toBe('function');
		expect(typeof merged.postprocess).toBe('function');
	});

	test('wires the plain parser on the markdown globs', async () => {
		const configs = await markdown();
		const parser = configs.find(config => config.name === MARKDOWN_CONFIG_NAME_SETUP_PARSER);
		const parserValue = parser?.languageOptions?.['parser'] as
			undefined | { meta?: { name?: string }; parseForESLint?: unknown };

		expect(parser?.files).toEqual(GLOB_MARKDOWN);
		expect(parserValue?.meta?.name).toBe('eslint-parser-plain');
		expect(typeof parserValue?.parseForESLint).toBe('function');
	});

	test('the merged processor keeps code block virtual files and the markdown file itself', async () => {
		const configs = await markdown();
		const merged = configs.find(config => config.name === MARKDOWN_CONFIG_NAME_SETUP_PROCESSOR)?.processor;

		if (typeof merged === 'string' || !merged) {
			throw new TypeError('expected a merged processor object');
		}

		const files = merged.preprocess?.('# Fixture\n\n```ts\nconst a=1\n```\n', 'fixture.md');
		const result = merged.postprocess?.([[], []] as never, 'fixture.md');

		expect(Array.isArray(files)).toBe(true);
		expect(files?.length).toBeGreaterThanOrEqual(2);
		expect(result).toEqual([]);
	});

	test('accepts a flat config item mixed into the first argument', async () => {
		const configs = await markdown({
			name: 'consumer/inline',
			rules: { 'markdown/no-html': 'off' },
		});
		const inline = configs.find(config => config.name === 'consumer/inline');

		expect(inline?.rules?.['markdown/no-html']).toBe('off');
	});

	test('appends consumer configs after the markdown slice', async () => {
		const configs = await markdown({}, { name: 'consumer/override', rules: { 'markdown/no-html': 'off' } });

		expect(configs.at(-1)?.name).toBe('consumer/override');
	});
});
