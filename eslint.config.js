import Importer from 'jiti';

const importer = Importer(import.meta.url);
/**
 *@type {import('./src').default}
 */
const hexadrop = importer('./src').default;

export default hexadrop(
	{ ignores: ['.impeccable', 'bun.lock', 'tests/e2e/fixtures'] },
	{ name: 'e2e/react-version', settings: { react: { version: 'detect' } } }
);
