const crypto = require('crypto');

const CRYPTO_KEY = Buffer.from(
	'KgSAOli9bHgiQB+Verg5q5MUMRqYvEVSr38cNQe98L4=',
	'base64',
);

/**
 * @param {Buffer} value
 * @param {Buffer} iv
 * @returns {Buffer}
 */
exports.encrypt = ({value, iv}) => {
	const cipher = crypto.createCipheriv('aes-256-cbc', CRYPTO_KEY, iv);

	return Buffer.concat([cipher.setAutoPadding(true).update(value), cipher.final()]);
};

/**
 * @param {Buffer} value
 * @param {Buffer} iv
 * @returns {Buffer}
 */
exports.decrypt = ({value, iv}) => {
	const decipher = crypto.createDecipheriv('aes-256-cbc', CRYPTO_KEY, iv);

	return Buffer.concat([decipher.update(value), decipher.final()]);
};
