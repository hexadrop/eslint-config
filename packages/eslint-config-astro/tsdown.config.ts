import { defineConfig } from 'tsdown';

export default defineConfig({
	deps: {
		alwaysBundle: ['@hexadrop/eslint-config-shared'],
		neverBundle: ['@typescript-eslint/parser'],
	},
	dts: true,
	entry: ['src/index.ts'],
});
