module.exports = {
	// Define the configuration for `.astro` file.
	files: ['*.astro'],
	// Enable this plugin
	plugins: ['astro'],
	env: {
		// Enables global variables available in Astro components.
		node: true,
		'astro/astro': true,
		es2020: true,
	},
	// Allows Astro components to be parsed.
	parser: 'astro-eslint-parser',
	/*
	 * Parse the script in `.astro` as TypeScript by adding the following configuration.
	 * It's the setting you need when using TypeScript.
	 */
	parserOptions: {
		parser: '@typescript-eslint/parser',
		extraFileExtensions: ['.astro'],
		// The script of Astro components uses ESM.
		sourceType: 'module',
	},
	rules: {
		'astro/no-conflict-set-directives': 'error',
		'astro/no-deprecated-astro-canonicalurl': 'error',
		'astro/no-deprecated-astro-fetchcontent': 'error',
		'astro/no-deprecated-astro-resolve': 'error',
		'astro/no-deprecated-getentrybyslug': 'error',
		'astro/no-unused-define-vars-in-style': 'error',
		'astro/valid-compile': 'error',
	},
};
