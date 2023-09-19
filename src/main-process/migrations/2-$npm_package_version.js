'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "endpoint" to table "settings"
 *
 **/

const info = {
	revision: 2,
	name: '$npm_package_version',
	created: '2023-09-18T22:42:26.680Z',
	comment: '',
};

const migrationCommands = [{
	fn: 'addColumn',
	params: [
		'settings',
		'endpoint',
		{
			type: Sequelize.STRING,
			field: 'endpoint',
			allowNull: true,
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
