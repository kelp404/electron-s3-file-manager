const fs = require('fs');
const path = require('path');

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

module.exports = handlers;
