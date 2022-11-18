const fs = require('fs');
const {
	DATABASE_PATH,
	connectDatabase,
	runMigrations,
} = require('../../src/main-process/common/database');

module.exports = async () => {
	fs.rmSync(DATABASE_PATH, {force: true});
	connectDatabase();
	await runMigrations();
};
