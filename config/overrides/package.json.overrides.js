module.exports = {
	files: ['package.json'],
	rules: {
		'jsonc/sort-keys': [
			'error',
			// For example, a definition for package.json
			{
				pathPattern: '^$',
				order: [
					'name',
					'version',
					'description',
					'keywords',
					'homepage',
					'bugs',
					'repository',
					'license',
					'private',
					'publishConfig',
					'files',
					'main',
					'module',
					'types',
					'exports',
					'typesVersions',
					'scripts',
					'dependencies',
					'peerDependencies',
					'peerDependenciesMeta',
					'devDependencies',
					'volta',
					'packageManager',
				],
			},
			{
				pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
				order: { type: 'asc' },
			},
			// ...
		],
	},
};
