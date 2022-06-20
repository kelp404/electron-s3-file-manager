const Validator = require('fastest-validator');

const validator = new Validator({
	useNewCustomCheckerFunction: true,
});

module.exports = {
	validator,
};
