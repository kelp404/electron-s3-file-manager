module.exports = {
	path: {
		type: 'string',
		optional: false,
		empty: false,
		max: 1024,
		pattern: /^[^/].*$/,
	},
	dirname: {
		type: 'string',
		optional: false,
		empty: true,
		max: 1024,
		pattern: /^([^/]|([^/].*[^/]))$/,
	},
	basename: {
		type: 'string',
		optional: false,
		empty: false,
		max: 1024,
		pattern: /^[^/]*$/,
	},
};
