/**
 * Convert the fastest-validator validate function for Formik.
 * @param {function} checkFunction
 * @returns {(function(values): Object)}
 */
exports.makeFormikValidator = checkFunction => values => {
	const result = {};
	const checkResult = checkFunction(values);

	if (checkResult === true) {
		return result;
	}

	checkResult.forEach(item => {
		result[item.field] = item.message;
	});
	return result;
};
