import Importer from 'jiti'

const importer = Importer(import.meta.url)
/**
 * @type {import('./src').default}
 */
const hexatool = importer('./src').default

export default hexatool({
	typescript: {
		tsconfigPath: './tsconfig.json',
	}
});
