module.exports = {
	/*
	 * Define the configuration for `<script>` tag.
	 * Script in `<script>` is assigned a virtual file name with the `.js` extension.
	 */
	files: ['**/*.astro/*.js', '*.astro/*.js'],
	env: {
		browser: true,
		es2020: true,
	},
	parserOptions: {
		sourceType: 'module',
	},
	rules: {
		/*
		 * Override/add rules settings here, such as:
		 * "no-unused-vars": "error"
		 */

		/*
		 * If you are using "prettier/prettier" rule,
		 * you don't need to format inside <script> as it will be formatted as a `.astro` file.
		 */
		'prettier/prettier': 'off',
	},
};
