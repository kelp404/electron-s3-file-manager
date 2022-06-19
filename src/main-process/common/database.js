const path = require('path');
const {app} = require('electron');
const {Sequelize} = require('sequelize');
const {
	DATABASE_FILENAME,
} = require('../../shared/constants/config');

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
