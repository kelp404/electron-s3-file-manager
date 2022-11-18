const path = require('path');

module.exports = {
	maxConcurrency: 1,
	maxWorkers: 1,
	testTimeout: 10000,
	testEnvironment: './test-environment.js',
	transform: {
		'\\.js$': ['babel-jest', {
			configFile: path.join(__dirname, 'babel.config.js'),
		}],
	},
	moduleNameMapper: {
		'^electron$': '<rootDir>/mocks/electron.js',
	},
	testPathIgnorePatterns: [
		'__tests__/main-process/babel.config.js',
		'__tests__/main-process/jest.config.js',
		'__tests__/main-process/test-environment.js',
		'__tests__/main-process/utils.js',
		'__tests__/main-process/mocks',
		'__tests__/render-process',
	],
};
