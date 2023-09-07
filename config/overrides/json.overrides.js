module.exports = {
	files: ['*.json', '*.json5', '*.jsonc'],
	parser: 'jsonc-eslint-parser',
	extends: ['plugin:jsonc/recommended-with-jsonc', 'plugin:jsonc/prettier'],
};
