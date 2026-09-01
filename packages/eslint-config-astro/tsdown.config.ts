import { defineConfig } from 'tsdown';

export default defineConfig({
	deps: {
		alwaysBundle: ['@hexadrop/eslint-config-shared'],
		neverBundle: true,
	},
	dts: true,
	entry: ['src/index.ts'],
});
