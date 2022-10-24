const crypto = require('crypto');
const sequelize = require('sequelize');
const sqlString = require('sequelize/lib/sql-string');

// 32 bytes key.
const CRYPTO_KEY = Buffer.from(
	'KgSAOli9bHgiQB+Verg5q5MUMRqYvEVSr38cNQe98L4=',
	'base64',
);

/**
 * @param {Buffer} value
 * @param {Buffer} iv - 16 bytes iv
 * @returns {Buffer}
 */
exports.encrypt = ({value, iv}) => {
	const cipher = crypto.createCipheriv('aes-256-cbc', CRYPTO_KEY, iv);

	return Buffer.concat([cipher.setAutoPadding(true).update(value), cipher.final()]);
};

/**
 * @param {Buffer} value
 * @param {Buffer} iv - 16 bytes iv
 * @returns {Buffer}
 */
exports.decrypt = ({value, iv}) => {
	const decipher = crypto.createDecipheriv('aes-256-cbc', CRYPTO_KEY, iv);

	return Buffer.concat([decipher.update(value), decipher.final()]);
};

/**
 * Parse the keyword.
 * @param {string} keyword - The keyword.
 * @returns {{plus: Array<string>, minus: Array<string>, fields: {}}} The query object.
 */
exports.parseKeyword = keyword => {
	const originalKeywords = [];
	const plus = [];
	const minus = [];
	const fields = {};

	if (!keyword) {
		return {plus, minus, fields};
	}

	// ": " -> ":", "\u200b" -> ""
	keyword = keyword
		.replace(/:\s/g, ':')
		.replace(/\u200b/g, '');

	// Match words in quotation mark
	const quotations = keyword.match(/["'](.*?)["']/g);
	(quotations || []).forEach(quotation => {
		keyword = keyword.replace(quotation, '');
		originalKeywords.push(quotation.substr(1, quotation.length - 2).trim());
	});

	// Remove " and '
	keyword = keyword.replace(/["']/g, '');
	keyword.split(' ').forEach(word => originalKeywords.push(word.trim()));

	originalKeywords.forEach(item => {
		if (!item) {
			return;
		}

		if (item.includes(':')) {
			const [field, value] = item.split(':');
			fields[field] = value;
		} else if (item[0] === '-') {
			minus.push(item.substr(1));
		} else {
			plus.push(item);
		}
	});

	return {plus, minus, fields};
};

/**
 * Generate sequelize like syntax.
 * ref:
 * 	How to escape `$like` wildcard characters `%` and `_` in sequelize?
 * 	https://stackoverflow.com/a/44236635
 * @param {string} value
 * @param {string} start - "%"
 * @param {string} end - "%"
 * @returns {Literal}
 */
exports.generateLikeSyntax = (value, {start = '%', end = '%'} = {}) => {
	const escapedValue = sqlString.escape(value);
	const items = [
		escapedValue.slice(0, 1),
		start,
		escapedValue.slice(1, -1).replace(/(%|_)/g, '\\$1'),
		end,
		escapedValue.slice(-1),
		' ESCAPE \'\\\'',
	];

	return sequelize.literal(items.join(''));
};
