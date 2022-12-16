const fs = require('fs');
const path = require('path');
const {program} = require('commander');
const pLimit = require('p-limit');

program
	.name(' ')
	.usage(
		`
  Force sync database schema (drop tables then create).
    node tools.js sync

  Remove database file.
    node tools.js rmdb

  Build electron app.
    node tools.js build`);

program
	.command('sync')
	.description('sync database schema');
program
	.command('rmdb')
	.description('remove database');
program
	.command('build')
	.description('build electron app');

program.parse(process.argv);

function removeDatabase() {
	const {DATABASE_PATH} = require('./src/main-process/common/database');

	console.log(`remove ${DATABASE_PATH}`);
	fs.rmSync(DATABASE_PATH, {force: true});
	return Promise.resolve();
}

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

function build() {
	return require('electron-builder')
		.build({
			x64: true,
			projectDir: path.resolve(__dirname),
			win: ['portable'],
			mac: ['dmg'],
			config: {
				copyright: 'Copyright © 2022 kelp404',
				directories: {
					output: 'dist',
				},
				files: [
					'package.json',
					'dist/main-process/**/*',
					'dist/renderer-process/**/*',
					'dist/shared/**/*',
				],
				extends: null,
			},
		});
}

async function execute() {
	const {args} = program;

	if (args[0] === 'sync') {
		return sync();
	}

	if (args[0] === 'rmdb') {
		return removeDatabase();
	}

	if (args[0] === 'build') {
		return build();
	}

	return program.help();
}

execute()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
