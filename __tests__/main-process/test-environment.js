const fs = require('fs');
const {TestEnvironment} = require('jest-environment-node');
const {
	DATABASE_PATH,
	connectDatabase,
	runMigrations,
} = require('../../src/main-process/common/database');

module.exports = class Environment extends TestEnvironment {
	async setup() {
		await super.setup();

		fs.rmSync(DATABASE_PATH, {force: true});
		connectDatabase();
		await runMigrations();
	}

	async teardown() {
		await super.teardown();
	}
};
