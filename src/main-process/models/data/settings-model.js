const {DataTypes} = require('sequelize');
const {connectDatabase} = require('../../common/database');

const {sequelize} = connectDatabase();

const attributes = {
};

const options = {
	indexes: [],
};
const Model = sequelize.define('settings', attributes, options);

module.exports = Model;
