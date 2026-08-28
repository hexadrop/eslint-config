import { createJiti } from 'jiti';

const importer = createJiti(import.meta.url);
/**
 *@type {import('./packages/eslint-config/src').default}
 */
const hexadrop = importer('./packages/eslint-config/src').default;

export default hexadrop({ ignores: ['e2e/fixtures'] });
