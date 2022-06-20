module.exports = {
	accessKeyId: {
		type: 'string',
		empty: false,
		max: 255,
	},
	secretAccessKey: {
		type: 'string',
		empty: false,
		max: 255,
	},
	region: {
		type: 'string',
		empty: false,
		max: 255,
	},
};
