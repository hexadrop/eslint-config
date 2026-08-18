/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
const config = {
	'*': 'bun run lint:fix',
};

export default config;
