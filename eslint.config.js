import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, {
	tsconfigPaths: true,
});
/**
 *@type {import('./packages/eslint-config/src').default}
 */
const hexadrop = jiti('./packages/eslint-config/src').default;

export default hexadrop(
	{ ignores: ['packages/**/e2e/fixtures'] },
	{
		files: ['packages/*/src/**', 'packages/*/scripts/**'],
		name: 'hexadrop/shared-imports',
		rules: {
			'import/no-extraneous-dependencies': ['error', { whitelist: ['@hexadrop/eslint-config-shared'] }],
		},
	}
);
