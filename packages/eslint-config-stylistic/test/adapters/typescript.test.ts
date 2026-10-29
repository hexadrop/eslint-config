import { describe, expect, test } from 'bun:test';

import { config } from '../../src';
import { configOptions } from '../helpers';

describe('typescript adapter', () => {
	test('emits the typescript rules without the type-aware section by default', async () => {
		const configs = await config(configOptions({ typescript: true }));
		const names = configs.map(c => c.name);

		expect(names).toContain('hexadrop/stylistic/rules/typescript');
		expect(names).toContain('hexadrop/stylistic/rules/typescript/dts');
		expect(names).not.toContain('hexadrop/stylistic/rules/typescript/type-aware');
	});

	test('applies the typescript-eslint stylistic rules', async () => {
		const configs = await config(configOptions({ typescript: true }));
		const rules = configs.find(c => c.name === 'hexadrop/stylistic/rules/typescript')?.rules;

		expect(rules?.['typescript/member-ordering']).toBeDefined();
		expect(rules?.['typescript/consistent-type-assertions']).toBe('off');
		expect(rules?.['typescript/prefer-for-of']).toBe('error');
	});

	test('adds the type-aware section only when requested', async () => {
		const configs = await config(configOptions({ isTypeAware: true, typescript: true }));
		const names = configs.map(c => c.name);
		const rules = configs.find(c => c.name === 'hexadrop/stylistic/rules/typescript/type-aware')?.rules;

		expect(names).toContain('hexadrop/stylistic/rules/typescript/type-aware');
		expect(rules?.['typescript/consistent-type-assertions']).toBe('error');
	});

	test('turns off comment rules on declaration files', async () => {
		const configs = await config(configOptions({ typescript: true }));
		const rules = configs.find(c => c.name === 'hexadrop/stylistic/rules/typescript/dts')?.rules;

		expect(rules?.['style/multiline-comment-style']).toBe('off');
		expect(rules?.['style/spaced-comment']).toBe('off');
	});

	test('emits no typescript items when the concern is disabled', async () => {
		const configs = await config(configOptions());
		const names = configs.map(c => c.name);

		expect(names.some(name => name?.includes('/typescript'))).toBe(false);
	});
});
