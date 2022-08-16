const dayjs = require('dayjs');
const filesize = require('filesize');

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

exports.addBusyClass = () => {
	document.body.classList.add('busy');
};

exports.removeBusyClass = () => {
	document.body.classList.remove('busy');
};

exports.loadStylesheet = href => new Promise((resolve, reject) => {
	const link = document.createElement('link');

	link.href = href;
	link.rel = 'stylesheet';
	link.onload = () => resolve(link);
	link.onerror = error => reject(error);

	document.head.append(link);
});

/**
 * Generate a date prop types for React.Component.
 * @param {boolean} isRequired - Is this field required?
 * @returns {function(props: Object, propName: string, componentName: string, location: string, propFullName: string)} - The prop types handler.
 */
exports.generateDatePropTypes = ({isRequired}) => (props, propName, componentName, location, propFullName) => {
	const value = props[propName];

	if (isRequired && (value == null || value === '')) {
		return new Error(
			`The prop "${propFullName}" is marked as required in "${componentName}", but its value is "${value}".`,
		);
	}

	if (value && Number.isNaN((new Date(value)).getTime())) {
		return new Error(
			`Invalid prop "${propFullName}" supplied to "${componentName}", expected "ISO String".`,
		);
	}
};

/**
 * Format date.
 * @param {string|number|Date} date
 * @returns {string} eg: "April 7, 2019 7:59:03 PM"
 */
exports.formatDate = date => {
	const parsedDate = dayjs(date);

	return `${parsedDate.format('LL')} ${parsedDate.format('LTS')}`;
};

/**
 * 1000 -> 1,000
 * @param {string|number|null} value - The number.
 * @returns {string}
 */
exports.formatNumber = value => {
	if (value == null) {
		return '';
	}

	return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

exports.formatSize = value =>
	filesize(value, {base: 2, round: 1, standard: 'jedec', symbols: {KB: 'kB'}});
