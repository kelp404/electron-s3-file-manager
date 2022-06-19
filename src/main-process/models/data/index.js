const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const {connectDatabase} = require('../../common/database');

const basename = path.basename(__filename);
const db = {};
const {sequelize} = connectDatabase();

fs
	.readdirSync(__dirname)
	.filter(file => (file.slice(0, 1) !== '.') && (file.slice(-3) === '.js') && (file !== basename))
	.forEach(file => {
		const model = require(path.join(__dirname, file));

		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
