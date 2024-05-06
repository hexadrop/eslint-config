declare module '@typescript-eslint/eslint-plugin' {
	import type { ESLint } from 'eslint';

	export default ESLint.Plugin;
}

declare module 'eslint-plugin-import-x' {
	import type { ESLint } from 'eslint';

	export default ESLint.Plugin;
}

declare module 'eslint-plugin-unused-imports' {
	import type { ESLint } from 'eslint';

	export default ESLint.Plugin;
}

declare module 'eslint-plugin-perfectionist/configs/recommended-natural' {
	import type { ESLint } from 'eslint';

	const config: {
		plugins: {
			perfectionist: ESLint.Plugin;
		};
	} & ESLint.Plugin;

	export default config;
}
