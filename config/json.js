const jsonOverrides = require('./overrides/json.overrides.js');
const packageJsonOverrides = require('./overrides/package.json.overrides.js');

module.exports = {
	overrides: [jsonOverrides, packageJsonOverrides],
};
