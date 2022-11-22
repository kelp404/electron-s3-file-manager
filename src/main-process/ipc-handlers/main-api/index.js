const fs = require('fs');
const path = require('path');
const {BadRequestError} = require('../../../shared/errors');
const {MAIN_API} = require('../../../shared/constants/ipc');

const basename = path.basename(__filename);
const handlers = {};

fs
	.readdirSync(__dirname)
	.filter(file => (file.slice(0, 1) !== '.') && (file.slice(-3) === '.js') && (file !== basename))
	.forEach(file => {
		const handler = require(path.join(__dirname, file));

		Object.entries(handler).forEach(([name, method]) => {
			if (handlers[name]) {
				throw new Error(`${name} of ${file} is duplicated`);
			}

			handlers[name] = method;
		});
	});

function generateIpcMainApiHandler() {
	return async (event, args = {}) => {
		const startTime = new Date();
		let error;

		try {
			const {method, data} = args;
			const handler = handlers[method];

			if (typeof handler !== 'function') {
				throw new BadRequestError(`not found "${method}"`);
			}

			const result = await handler({...data, $event: event});
			return [null, result];
		} catch (err) {
			error = err;
			return [
				typeof error.toJSON === 'function' ? error.toJSON() : error,
				null,
			];
		} finally {
			const processTimeInMillisecond = Date.now() - startTime;
			const processTime = `${processTimeInMillisecond}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

			console.log(
				`${MAIN_API} ${processTime.padStart(7)}ms ${`${args?.method}                              `.slice(0, 30)}`,
			);

			if (error) {
				console.error(error);
			}
		}
	};
}

module.exports = {
	handlers,
	generateIpcMainApiHandler,
};
