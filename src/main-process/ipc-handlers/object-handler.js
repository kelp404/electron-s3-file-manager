const {Op} = require('sequelize');
const utils = require('../common/utils');
const {
	NotFoundError,
} = require('../../shared/errors');
const ObjectModel = require('../models/data/object-model');

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
