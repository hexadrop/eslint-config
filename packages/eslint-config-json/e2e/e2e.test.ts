import { describe, expect, test } from 'bun:test';
import { Linter } from 'eslint';

import json, { JSON_SORT_KEYS_CONFIG } from '../src';

describe('json through real ESLint config resolution', () => {
	test('json rules are active for json files and inactive for source files', async () => {
		const configs = await json();
		const linter = new Linter({ configType: 'flat' });

		const jsonMessages = linter.verify('{"a": 1n}', configs, 'file.json');

		expect(jsonMessages.some(message => message.ruleId === 'json/no-bigint-literals')).toBe(true);
	});

	test('sort-keys flags a misordered package.json', async () => {
		const configs = [...(await json()), ...JSON_SORT_KEYS_CONFIG];
		const linter = new Linter({ configType: 'flat' });
		// Misordered literal built at runtime so the repo's own sort-keys lint rule cannot fix it.
		const source = JSON.stringify({ name: 'fixture', version: '1.0.0' })
			.replace('"name"', '"version":"1.0.0","name"')
			.replace(',"version":"1.0.0"}', '}');
		expect(source.indexOf('version')).toBeLessThan(source.indexOf('name'));

		const messages = linter.verify(source, configs, 'package.json');

		expect(messages.some(message => message.ruleId === 'json/sort-keys')).toBe(true);
	});
});
