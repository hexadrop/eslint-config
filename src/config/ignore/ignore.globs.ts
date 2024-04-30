const IGNORE_GLOB = [
	'**/node_modules',
	'**/dist',
	'**/package-lock.json',
	'**/yarn.lock',
	'**/pnpm-lock.yaml',
	'**/bun.lockb',

	'**/output',
	'**/coverage',
	'**/temp',
	'**/.temp',
	'**/tmp',
	'**/.tmp',
	'**/.history',
	'**/.vitepress/cache',
	'**/.nuxt',
	'**/.next',
	'**/.vercel',
	'**/.changeset',
	'**/.idea',
	'**/.cache',
	'**/.output',
	'**/.vite-inspect',
	'**/.yarn',

	'**/CHANGELOG*.md',
	'**/*.min.*',
	'**/LICENSE*',
	'**/__snapshots__',
];

export default IGNORE_GLOB;
