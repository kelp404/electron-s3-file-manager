const {Op} = require('sequelize');
const s3 = require('../common/s3');
const utils = require('../common/utils');
const {
	NotFoundError,
} = require('../../shared/errors');
const ObjectModel = require('../models/data/object-model');

/**
 * @param {string} dirname
 * @param {string} keyword
 * @param {integer} after
 * @param {integer} limit
 * @returns {Promise<{hasNextPage: boolean, items: ObjectModel[]}>}
 */
exports.getObjects = async ({dirname = '', keyword, after, limit = 50} = {}) => {
	const keywordConditions = [];
	const afterConditions = [];

	if (keyword) {
		const {plus, minus} = utils.parseKeyword(keyword);

		plus.forEach(plusKeyword => {
			keywordConditions.push({
				path: {[Op.like]: utils.generateLikeSyntax(plusKeyword)},
			});
		});
		minus.forEach(minusKeyword => {
			keywordConditions.push({
				path: {[Op.notLike]: utils.generateLikeSyntax(minusKeyword)},
			});
		});
	}

	if (after) {
		const cursor = await ObjectModel.findOne({
			where: {id: after},
			attributes: ['id', 'type', 'basename'],
		});

		if (cursor == null) {
			throw new NotFoundError(`not found object ${after}`);
		}

		afterConditions.push(
			{
				[Op.and]: [
					{type: {[Op.gte]: cursor.type}},
					{basename: {[Op.gt]: cursor.basename}},
				],
			},
			{
				[Op.and]: [
					{type: {[Op.gte]: cursor.type}},
					{basename: cursor.basename},
					{id: {[Op.gt]: cursor.id}},
				],
			},
		);
	}

	const objects = await ObjectModel.findAll({
		where: {
			dirname: keywordConditions.length
				? {[Op.like]: utils.generateLikeSyntax(dirname, {start: ''})}
				: dirname,
			...(afterConditions.length ? {[Op.or]: afterConditions} : undefined),
			...(keywordConditions.length ? {[Op.and]: keywordConditions} : undefined),
		},
		order: [
			['type', 'ASC'],
			['basename', 'ASC'],
			['id', 'ASC'],
		],
		limit: limit + 1,
	});

	return {
		hasNextPage: objects.length > limit,
		items: objects.slice(0, limit).map(object => object.toJSON()),
	};
};

/**
 * @param {number} id
 * @returns {Promise<ObjectModel>}
 */
exports.getObject = async ({id} = {}) => {
	const object = await ObjectModel.findOne({where: {id}});

	if (!object) {
		throw new NotFoundError();
	}

	const headers = await s3.headObject(object.path);
	const result = object.toJSON();

	if (headers.ContentType?.startsWith('video/')) {
		result.url = await s3.getSignedUrl(object.path);
	}

	result.objectHeaders = headers;
	return result;
};
