import { createJiti } from 'jiti';

const importer = createJiti(import.meta.url);
/**
 *@type {import('./packages/eslint-config/src').default}
 */
const hexadrop = importer('./packages/eslint-config/src').default;

export default hexadrop(
	{ ignores: ['.impeccable', 'bun.lock', 'packages/eslint-config/e2e/fixtures'] },
	{ name: 'e2e/react-version', settings: { react: { version: 'detect' } } }
);
