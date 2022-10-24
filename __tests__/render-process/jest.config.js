const path = require('path');

module.exports = {
	testEnvironment: './test-environment.js',
	transform: {
		'\\.js$': ['babel-jest', {
			configFile: path.join(__dirname, 'babel.config.js'),
		}],
	},
	testPathIgnorePatterns: [
		'__tests__/main-process',
		'__tests__/render-process/babel.config.js',
		'__tests__/render-process/jest.config.js',
		'__tests__/render-process/test-environment.js',
	],
};
