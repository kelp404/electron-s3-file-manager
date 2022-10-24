const {TestEnvironment} = require('jest-environment-jsdom');

module.exports = class Environment extends TestEnvironment {
	async setup() {
		await super.setup();
	}

	async teardown() {
		await super.teardown();
	}
};
