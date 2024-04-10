import JITI from 'jiti'

const jiti = JITI(import.meta.url)
/**
 * @type {import('./src').default}
 */
const hexatool = jiti('./src').default

export default hexatool();
