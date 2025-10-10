import { createJiti } from 'jiti';

const importer = createJiti(import.meta.url);
/**
 * @type {import('./src').default}
 */
const hexadrop = importer('./src').default;

export default hexadrop();
