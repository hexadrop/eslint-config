import { createJiti } from 'jiti';

const importer = createJiti(import.meta.url);
/**
 *@type {import('./src').default}
 */
const hexadrop = importer('./src').default;

export default hexadrop(
	{ ignores: ['.impeccable', 'bun.lock', 'e2e/fixtures'] },
	{ name: 'e2e/react-version', settings: { react: { version: 'detect' } } }
);
