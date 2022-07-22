const path = require('path');
const lodash = require('lodash');
const {DataTypes, NOW} = require('sequelize');
const OBJECT_TYPE = require('../../../shared/constants/object-type');
const STORAGE_CLASS = require('../../../shared/constants/storage-class');
const {connectDatabase} = require('../../common/database');

const {sequelize} = connectDatabase();
const attributes = {
	type: {
		type: DataTypes.TINYINT,
		allowNull: false,
		validate: {
			isIn: [Object.values(OBJECT_TYPE)],
		},
	},
	path: {
		type: new DataTypes.STRING(1024),
		allowNull: false,
		set(value) {
			const {dir, base} = path.parse(value);

			this.setDataValue('path', value);
			this.setDataValue('dirname', dir);
			this.setDataValue('basename', base);
		},
	},
	/**
	 * The folder name.
	 * 	"test.txt": ""
	 * 	"a/b/": "a"
	 * 	"a/b/test.txt": "a/b"
	 */
	dirname: {
		type: new DataTypes.STRING(1024),
		allowNull: false,
	},
	/**
	 * The file, folder name.
	 * 	"test.txt": "test.txt"
	 * 	"a/b/": "b"
	 * 	"a/b/test.txt": "test.txt"
	 */
	basename: {
		type: DataTypes.CITEXT,
		allowNull: false,
	},
	lastModified: {
		type: DataTypes.DATE,
		allowNull: true,
		defaultValue: NOW,
	},
	size: {
		type: DataTypes.BIGINT,
		allowNull: true,
		defaultValue: 0,
	},
	storageClass: {
		type: DataTypes.TINYINT,
		allowNull: true,
		validate: {
			isIn: [Object.values(STORAGE_CLASS)],
		},
		set(value) {
			if (typeof value === 'number' && Object.values(STORAGE_CLASS).includes(value)) {
				this.setDataValue('storageClass', value);
				return;
			}

			this.setDataValue('storageClass', STORAGE_CLASS[value] || null);
		},
		get() {
			const storageClass = this.getDataValue('storageClass');

			if (!storageClass) {
				return storageClass;
			}

			const entry = Object.entries(STORAGE_CLASS)
				.find(([_, value]) => value === storageClass);

			return entry[0];
		},
	},
};
const options = {
	indexes: [
		{
			unique: true,
			fields: ['path'],
		},
		{
			unique: false,
			fields: ['updatedAt'],
		},
		{
			unique: false,
			fields: ['dirname', 'type', 'basename', 'id'],
		},
	],
};
const Model = sequelize.define('object', attributes, options);

Model.prototype.toJSON = function () {
	const result = lodash.cloneDeep(this.get({plain: false}));

	if (this.type === OBJECT_TYPE.FOLDER) {
		delete result.lastModified;
		delete result.size;
		delete result.storageClass;
	}

	return result;
};

module.exports = Model;
