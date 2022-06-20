const {DataTypes} = require('sequelize');
const {connectDatabase} = require('../../common/database');

const {sequelize} = connectDatabase();
const attributes = {
	accessKeyId: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	secretAccessKey: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	region: {
		type: DataTypes.STRING,
		allowNull: true,
	},
};
const options = {
	indexes: [],
};
const Model = sequelize.define('settings', attributes, options);

module.exports = Model;
