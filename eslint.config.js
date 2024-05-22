import Importer from 'jiti';

const importer = Importer(import.meta.url);
/**
 * @type {import('./src').default}
 */
const hexadrop = importer('./src').default;

export default hexadrop();
