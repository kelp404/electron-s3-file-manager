const fs = require('fs');
const path = require('path');
const {app} = require('electron');
const pLimit = require('p-limit');
const {Sequelize} = require('sequelize');
const migrate = require('@kelp404/sequelize-auto-migrations/lib/migrate');
const {
	DATABASE_FILENAME,
} = require('../../shared/constants/config');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

exports.DATABASE_PATH = typeof app?.getPath === 'function'
	? path.join(app.getPath('userData'), DATABASE_FILENAME)
	: path.join(require('appdata-path')(), 'Electron', DATABASE_FILENAME);

exports._sequelize = null;
exports.connectDatabase = ({isLogSQL = false} = {}) => {
	exports._sequelize = exports._sequelize || new Sequelize({
		dialect: 'sqlite',
		storage: exports.DATABASE_PATH,
		logging: isLogSQL ? console.log : false,
	});

	return {
		sequelize: exports._sequelize,
	};
};

exports.disconnectDatabase = () => {
	exports._sequelize = null;
};

exports.runMigrations = async () => {
	const {sequelize} = require('../models/data');
	const queryInterface = sequelize.getQueryInterface();
	const limit = pLimit(1);
	let fromPos = 0;
	let migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
		.filter(file => (file.slice(0, 1) !== '.') && (file.slice(-3) === '.js'))
		.sort((a, b) => {
			const revA = parseInt(path.basename(a).split('-', 2)[0], 10);
			const revB = parseInt(path.basename(b).split('-', 2)[0], 10);

			if (revA < revB) {
				return -1;
			}

			if (revA > revB) {
				return 1;
			}

			return 0;
		});

	await queryInterface.createTable('SequelizeMeta', {
		name: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		},
	});
	const results = await queryInterface.rawSelect(
		'SequelizeMeta',
		{
			where: {},
			plain: false,
		},
		['name'],
	);
	const ranMigrations = results.map(r => r.name);

	migrationFiles = migrationFiles.filter(mf => {
		return (!ranMigrations.includes(mf));
	});
	migrationFiles.forEach(file => {
		console.log(`\t${file}`);
	});

	await Promise.all(migrationFiles.map(file => limit(async () => {
		await migrate.executeMigration(queryInterface, path.join(MIGRATIONS_DIR, file), fromPos);
		await queryInterface.bulkInsert('SequelizeMeta', [{
			name: file,
		}]);
		fromPos = 0;
	})));

	if (migrationFiles.length === 0) {
		console.log('No new migration files found');
	} else {
		console.log('Completed running migrations');
	}
};
