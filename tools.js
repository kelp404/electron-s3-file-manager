const fs = require('fs');
const bluebird = require('bluebird');
const {program} = require('commander');
const pLimit = require('p-limit');

bluebird.longStackTraces();
global.Promise = bluebird;

program
	.name(' ')
	.usage(
		`
  Force sync database schema (drop tables then create).
    node tools.js sync`);

program
	.command('sync')
	.description('sync database schema');

program.parse(process.argv);

async function sync() {
	const {connectDatabase, DATABASE_PATH} = require('./src/main-process/common/database');
	const limit = pLimit(1);

	fs.rmSync(DATABASE_PATH, {force: true});
	connectDatabase({isLogSQL: true});

	const models = require('./src/main-process/models/data');

	await Promise.all(
		Object.values(models.sequelize.models).map(model => limit(() => model.sync({force: true}))),
	);
}

async function execute() {
	const {args} = program;

	if (args[0] === 'sync') {
		return sync();
	}

	return program.help();
}

execute()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
