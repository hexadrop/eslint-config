import { createJiti } from 'jiti';

const importer = createJiti(import.meta.url);
/**
 *@type {import('./packages/eslint-config/src').default}
 */
const hexadrop = importer('./packages/eslint-config/src').default;

export default hexadrop(
	{ ignores: ['.impeccable', 'bun.lock', 'packages/*/e2e/fixtures', 'packages/*/src/typegen.d.ts'] },
	{ name: 'e2e/react-version', settings: { react: { version: 'detect' } } },
	{
		/*
		 * The private shared package is resolved via tsconfig paths and bundled into each
		 * package's dist, so it is intentionally not declared in any package manifest.
		 */
		files: ['packages/*/src/**'],
		name: 'hexadrop/shared-imports',
		rules: {
			'import/no-extraneous-dependencies': [
				'error',
				{ whitelist: ['@hexadrop/eslint-config-shared', 'globals', '@typescript-eslint/parser'] },
			],
		},
	}
);
