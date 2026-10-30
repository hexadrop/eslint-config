import { describe, expect, test } from 'bun:test';

import stripJsonc from '../src/utils/jsonc';

describe('stripJsonc', () => {
	test('removes line and block comments', () => {
		const source = '{\n\t// line\n\t"a": 1, /* block */\n\t"b": 2\n}';

		expect(JSON.parse(stripJsonc(source))).toEqual({ a: 1, b: 2 });
	});

	test('removes trailing commas before a closing brace or bracket', () => {
		const source = '{\n\t"a": [1, 2,],\n\t"b": { "c": 3, },\n}';

		expect(JSON.parse(stripJsonc(source))).toEqual({ a: [1, 2], b: { c: 3 } });
	});

	test('keeps commas inside strings that look like trailing commas', () => {
		const source = '{\n\t"note": "a, }",\n\t"other": "b, ]"\n}';

		expect(JSON.parse(stripJsonc(source))).toEqual({ note: 'a, }', other: 'b, ]' });
	});

	test('keeps urls and comment markers inside strings', () => {
		const source = '{\n\t"url": "https://example.com/*x*/",\n\t"note": "// not a comment"\n}';

		expect(JSON.parse(stripJsonc(source))).toEqual({
			note: '// not a comment',
			url: 'https://example.com/*x*/',
		});
	});
});
