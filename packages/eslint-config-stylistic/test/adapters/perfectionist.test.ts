import { describe, expect, test } from 'bun:test';

import { config } from '../../src';
import { configOptions } from '../helpers';

describe('perfectionist adapter', () => {
	test('emits the perfectionist rules with the hexadrop overrides', async () => {
		const configs = await config(configOptions({ perfectionist: true }));
		const rules = configs.find(c => c.name === 'hexadrop/stylistic/rules/perfectionist')?.rules;

		expect(rules?.['perfectionist/sort-jsx-props']).toBe('error');
		expect(rules?.['perfectionist/sort-imports']).toBe('off');
		expect(rules?.['perfectionist/sort-object']).toEqual(['off', { specialCharacters: 'trim' }]);
	});

	test('emits no perfectionist items when the concern is disabled', async () => {
		const configs = await config(configOptions());
		const names = configs.map(c => c.name);

		expect(names).not.toContain('hexadrop/stylistic/rules/perfectionist');
	});
});
