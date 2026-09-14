import { describe, expect, test } from 'bun:test';

import markdown from '../src';

const SETUP = 'hexadrop/markdown/setup';
const SETUP_PROCESSOR = 'hexadrop/markdown/setup/processor';
const SETUP_PARSER = 'hexadrop/markdown/setup/parser';
const MD_GLOBS = ['**/*.md'];
const MD_IN_MD_GLOBS = ['**/*.md/*.md'];

describe('markdown config', () => {
	test('returns an array with at least the internal slice entries', async () => {
		const configs = await markdown();

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBeGreaterThanOrEqual(3);
	});

	test('emits the markdown config names', async () => {
		const configs = await markdown();
		const names = configs.map(config => config.name);

		expect(names).toContain(SETUP);
		expect(names).toContain(SETUP_PROCESSOR);
		expect(names).toContain(SETUP_PARSER);
	});

	test('registers the @eslint/markdown plugin under the `markdown` prefix', async () => {
		const configs = await markdown();
		const setup = configs.find(config => config.name === SETUP);

		expect(setup?.plugins?.['markdown']).toBeDefined();
	});

	test('merges a pass-through processor on the markdown globs', async () => {
		const configs = await markdown();
		const processor = configs.find(config => config.name === SETUP_PROCESSOR);
		const merged = processor?.processor;

		expect(processor?.files).toEqual(MD_GLOBS);
		expect(processor?.ignores).toEqual(MD_IN_MD_GLOBS);
		if (typeof merged === 'string' || !merged) {
			throw new TypeError('expected a merged processor object');
		}

		expect(typeof merged.preprocess).toBe('function');
		expect(typeof merged.postprocess).toBe('function');
	});

	test('wires the plain parser on the markdown globs', async () => {
		const configs = await markdown();
		const parser = configs.find(config => config.name === SETUP_PARSER);
		const parserValue = parser?.languageOptions?.['parser'] as
			undefined | { meta?: { name?: string }; parseForESLint?: unknown };

		expect(parser?.files).toEqual(MD_GLOBS);
		expect(parserValue?.meta?.name).toBe('eslint-parser-plain');
		expect(typeof parserValue?.parseForESLint).toBe('function');
	});

	test('processor emits code-block virtual files plus a pass-through for the original file', async () => {
		const configs = await markdown();
		const merged = configs.find(config => config.name === SETUP_PROCESSOR)?.processor;

		if (typeof merged === 'string' || !merged) {
			throw new TypeError('expected a merged processor object');
		}

		const files = merged.preprocess?.('# Fixture\n\n```ts\nconst a=1\n```\n', 'fixture.md');
		const result = merged.postprocess?.([[], []] as never, 'fixture.md');

		expect(Array.isArray(files)).toBe(true);
		expect(files?.length).toBeGreaterThanOrEqual(2);
		expect(result).toEqual([]);
	});

	test('snapshot: full config structure', async () => {
		const configs = await markdown();
		const sanitised = configs.map(({ languageOptions, plugins, processor, ...rest }) => ({
			...rest,
			languageOptions: languageOptions
				? { parser: languageOptions['parser'] ? '<parser>' : undefined }
				: undefined,
			plugins: plugins ? Object.keys(plugins) : undefined,
			processor: processor ? '<processor>' : undefined,
		}));

		expect(sanitised).toMatchSnapshot('markdown-full-config');
	});

	test('mixes an inline config item into the first argument', async () => {
		const configs = await markdown({
			name: 'consumer/inline',
			rules: { 'markdown/no-html': 'off' },
		});
		const inline = configs.find(config => config.name === 'consumer/inline');

		expect(inline?.rules?.['markdown/no-html']).toBe('off');
	});

	test('appends consumer configs after the internal slice', async () => {
		const configs = await markdown({}, { name: 'consumer/override', rules: { 'markdown/no-html': 'off' } });

		expect(configs.at(-1)?.name).toBe('consumer/override');
	});
});
