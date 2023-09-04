const def = require('./default.js');
const markdownOverrides = require('./overrides/markdown.overrides.js');
const jsonOverrides = require('./overrides/json.overrides.js');
const packageJsonOverrides = require('./overrides/package.json.overrides.js');

module.exports = {
	...def,
	overrides: [...def.overrides, markdownOverrides, jsonOverrides, packageJsonOverrides],
};
