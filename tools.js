const fs = require('fs');
const path = require('path');
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
    node tools.js sync

	Build electron app.
		node tools.js build`);

program
	.command('sync')
	.description('sync database schema');
program
	.command('build')
	.description('build electron app');

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

function build() {
	return require('electron-builder')
		.build({
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
