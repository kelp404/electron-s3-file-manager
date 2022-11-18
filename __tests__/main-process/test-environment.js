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

		console.log('start ----------- runMigrations', new Date(), process.env.JEST_WORKER_ID);
		fs.rmSync(DATABASE_PATH, {force: true});
		connectDatabase();
		await runMigrations();
		console.log('done ----------- runMigrations', new Date(), process.env.JEST_WORKER_ID);
	}

	async teardown() {
		await super.teardown();
	}
};
