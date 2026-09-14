import { describe, expect, test } from 'bun:test';

import stylisticFactory, { config } from '../src';

const SETUP = 'hexadrop/stylistic/setup';
const RULES = 'hexadrop/stylistic/rules';

const fullOptions = {
	astro: false,
	isTypeAware: true,
	json: false,
	markdown: false,
	stylistic: {
		arrowParens: 'avoid' as const,
		braceStyle: '1tbs' as const,
		bracketSameLine: true,
		bracketSpacing: true,
		endOfLine: 'lf' as const,
		format: true,
		imports: true,
		indent: 'tab' as const,
		indentSize: 4,
		perfectionist: true,
		printWidth: 120,
		quoteProps: 'as-needed' as const,
		quotes: 'single' as const,
		semicolons: true,
		singleAttributePerLine: true,
		trailingComma: 'es5' as const,
		unicorn: true,
	},
	typescript: true,
};

describe('stylistic config', () => {
	test('returns a FlatConfigComposer', async () => {
		const composer = stylisticFactory(fullOptions);

		const configs = await composer;
		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBeGreaterThanOrEqual(2);
	});

	test('emits the stylistic config names', async () => {
		const configs = await config(fullOptions);
		const names = configs.map(c => c.name);

		expect(names).toContain(SETUP);
		expect(names).toContain(RULES);
	});

	test('registers the @stylistic plugin under the `style` prefix', async () => {
		const configs = await config(fullOptions);
		const setup = configs.find(c => c.name === SETUP);

		expect(setup?.plugins?.['style']).toBeDefined();
	});

	describe('peer matrix', () => {
		const minimalOpts = {
			...fullOptions,
			stylistic: { ...fullOptions.stylistic, unicorn: false, perfectionist: false, format: false },
		};

		test('includes typescript section when typescript is enabled', async () => {
			const configs = await config({ ...minimalOpts, typescript: true });
			const names = configs.map(c => c.name);
			expect(names).toContain('hexadrop/stylistic/rules/typescript');
		});

		test('skips typescript section when typescript is disabled', async () => {
			const configs = await config({ ...minimalOpts, typescript: false });
			const names = configs.map(c => c.name);
			expect(names).not.toContain('hexadrop/stylistic/rules/typescript');
		});

		test('includes json section when json is enabled', async () => {
			const configs = await config({ ...minimalOpts, json: true });
			const names = configs.map(c => c.name);
			expect(names).toContain('hexadrop/stylistic/rules/json');
		});

		test('skips json section when json is disabled', async () => {
			const configs = await config({ ...minimalOpts, json: false });
			const names = configs.map(c => c.name);
			expect(names).not.toContain('hexadrop/stylistic/rules/json');
		});

		test('includes astro section when astro is enabled', async () => {
			const configs = await config({ ...minimalOpts, astro: true });
			const names = configs.map(c => c.name);
			expect(names).toContain('hexadrop/stylistic/rules/astro');
		});

		test('skips astro section when astro is disabled', async () => {
			const configs = await config({ ...minimalOpts, astro: false });
			const names = configs.map(c => c.name);
			expect(names).not.toContain('hexadrop/stylistic/rules/astro');
		});

		test('includes unicorn section when unicorn is enabled', async () => {
			const opts = { ...minimalOpts, stylistic: { ...minimalOpts.stylistic, unicorn: true } };
			const configs = await config(opts);
			const names = configs.map(c => c.name);
			expect(names).toContain('hexadrop/stylistic/rules/unicorn');
		});

		test('skips unicorn section when unicorn is disabled', async () => {
			const configs = await config(minimalOpts);
			const names = configs.map(c => c.name);
			expect(names).not.toContain('hexadrop/stylistic/rules/unicorn');
		});

		test('includes perfectionist section when perfectionist is enabled', async () => {
			const opts = { ...minimalOpts, stylistic: { ...minimalOpts.stylistic, perfectionist: true } };
			const configs = await config(opts);
			const names = configs.map(c => c.name);
			expect(names).toContain('hexadrop/stylistic/rules/perfectionist');
		});

		test('skips perfectionist section when perfectionist is disabled', async () => {
			const configs = await config(minimalOpts);
			const names = configs.map(c => c.name);
			expect(names).not.toContain('hexadrop/stylistic/rules/perfectionist');
		});

		test('includes format/prettier section when format is enabled', async () => {
			const opts = { ...minimalOpts, stylistic: { ...minimalOpts.stylistic, format: true } };
			const configs = await config(opts);
			const names = configs.map(c => c.name);
			expect(names).toContain('hexadrop/stylistic/rules/prettier');
		});

		test('skips format/prettier section when format is disabled', async () => {
			const configs = await config(minimalOpts);
			const names = configs.map(c => c.name);
			expect(names).not.toContain('hexadrop/stylistic/rules/prettier');
		});
	});

	test('returns empty config when stylistic is false via factory', async () => {
		const composer = stylisticFactory({ ...fullOptions, stylistic: false });
		const configs = await composer;

		// The factory returns an empty FlatConfigComposer when stylistic is false
		expect(configs.length).toBe(0);
	});

	test('appends consumer configs after the internal slice', async () => {
		const composer = stylisticFactory(fullOptions, {
			name: 'consumer/override',
			rules: { curly: 'off' as const },
		} as unknown as Parameters<typeof stylisticFactory>[1]);

		const configs = await composer;

		expect(configs.at(-1)?.name).toBe('consumer/override');
	});

	test('snapshot: full config structure', async () => {
		const configs = await config(fullOptions);
		const sanitised = configs.map(({ plugins, ...rest }) => ({
			...rest,
			plugins: plugins ? Object.keys(plugins) : undefined,
		}));

		expect(sanitised).toMatchSnapshot('stylistic-full-config');
	});
});