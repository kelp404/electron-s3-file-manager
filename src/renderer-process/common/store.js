const PubSub = require('pubsub-js');

const data = {};

/**
 * @param {string} key
 * @param {function(keyWithPrefix: string, data)} handler
 * @returns {function()} - The unsubscribe function.
 */
exports.subscribe = (key, handler) => {
	const token = PubSub.subscribe(key, handler);

	return () => PubSub.unsubscribe(token);
};

/**
 * @param {string} key
 * @param {any} value
 * @returns {*}
 */
exports.broadcast = (key, value) => {
	return PubSub.publishSync(key, value);
};

/**
 * @param {string} key
 * @param {any} value
 * @returns {*}
 */
exports.set = (key, value) => {
	data[key] = value;

	return PubSub.publishSync(key, value);
};

/**
 * @param {string} key
 * @returns {*}
 */
exports.get = key => data[key];
