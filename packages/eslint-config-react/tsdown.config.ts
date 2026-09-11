import { defineConfig } from 'tsdown';

export default defineConfig({
	deps: {
		alwaysBundle: ['@hexadrop/eslint-config-shared'],
	},
	dts: true,
	entry: ['src/index.ts'],
});
