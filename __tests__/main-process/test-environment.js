const {TestEnvironment} = require('jest-environment-node');

module.exports = class Environment extends TestEnvironment {
	async setup() {
		await super.setup();
	}

	async teardown() {
		await super.teardown();
	}
};
