'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "objects", deps: []
 * createTable "settings", deps: []
 * addIndex "objects_path" to table "objects"
 * addIndex "objects_updated_at" to table "objects"
 * addIndex "objects_dirname_type_basename_id" to table "objects"
 *
 **/

const info = {
	revision: 1,
	name: '0.1.0',
	created: '2022-07-22T08:03:27.228Z',
	comment: '',
};

const migrationCommands = [{
	fn: 'createTable',
	params: [
		'objects',
		{
			id: {
				type: Sequelize.INTEGER,
				field: 'id',
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			type: {
				type: Sequelize.TINYINT,
				field: 'type',
				validate: {
					isIn: [
						[1, 2],
					],
				},
				allowNull: false,
			},
			path: {
				type: Sequelize.STRING(1024),
				field: 'path',
				allowNull: false,
			},
			dirname: {
				type: Sequelize.STRING(1024),
				field: 'dirname',
				allowNull: false,
			},
			basename: {
				type: Sequelize.CITEXT,
				field: 'basename',
				allowNull: false,
			},
			lastModified: {
				type: Sequelize.DATE,
				field: 'lastModified',
				defaultValue: Sequelize.NOW,
				allowNull: true,
			},
			size: {
				type: Sequelize.BIGINT,
				field: 'size',
				defaultValue: 0,
				allowNull: true,
			},
			storageClass: {
				type: Sequelize.TINYINT,
				field: 'storageClass',
				validate: {
					isIn: [
						[1, 2, 3, 4, 5, 6, 7, 8, 9],
					],
				},
				allowNull: true,
			},
			createdAt: {
				type: Sequelize.DATE,
				field: 'createdAt',
				allowNull: false,
			},
			updatedAt: {
				type: Sequelize.DATE,
				field: 'updatedAt',
				allowNull: false,
			},
		},
		{},
	],
},
{
	fn: 'createTable',
	params: [
		'settings',
		{
			id: {
				type: Sequelize.INTEGER,
				field: 'id',
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			cryptoIv: {
				type: Sequelize.STRING,
				field: 'cryptoIv',
				allowNull: true,
			},
			accessKeyId: {
				type: Sequelize.STRING,
				field: 'accessKeyId',
				allowNull: true,
			},
			secretAccessKey: {
				type: Sequelize.STRING,
				field: 'secretAccessKey',
				allowNull: true,
			},
			region: {
				type: Sequelize.STRING,
				field: 'region',
				allowNull: true,
			},
			bucket: {
				type: Sequelize.STRING,
				field: 'bucket',
				allowNull: true,
			},
			createdAt: {
				type: Sequelize.DATE,
				field: 'createdAt',
				allowNull: false,
			},
			updatedAt: {
				type: Sequelize.DATE,
				field: 'updatedAt',
				allowNull: false,
			},
		},
		{},
	],
},
{
	fn: 'addIndex',
	params: [
		'objects',
		['path'],
		{
			indexName: 'objects_path',
			name: 'objects_path',
			indicesType: 'UNIQUE',
			type: 'UNIQUE',
		},
	],
},
{
	fn: 'addIndex',
	params: [
		'objects',
		['updatedAt'],
		{
			indexName: 'objects_updated_at',
			name: 'objects_updated_at',
		},
	],
},
{
	fn: 'addIndex',
	params: [
		'objects',
		['dirname', 'type', 'basename', 'id'],
		{
			indexName: 'objects_dirname_type_basename_id',
			name: 'objects_dirname_type_basename_id',
		},
	],
}];

module.exports = {
	pos: 0,
	up(queryInterface, Sequelize) {
		let index = this.pos;
		return new Promise((resolve, reject) => {
			function next() {
				if (index < migrationCommands.length) {
					const command = migrationCommands[index];
					console.log('[#' + index + '] execute: ' + command.fn);
					index++;
					queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
				} else {
					resolve();
				}
			}

			next();
		});
	},
	info,
};
