const PAGINATION_MAX_LIMIT = 100;
const MAX_ID_VALUE = 0x7FFFFFFF;

function generateIdSchema({fieldName = 'id'} = {}) {
	// Ref: https://dev.mysql.com/doc/refman/8.0/en/integer-types.html
	return {
		[fieldName]: {
			type: 'number',
			optional: false,
			convert: true,
			min: 1,
			max: MAX_ID_VALUE,
			integer: true,
		},
	};
}

exports.generateCursorPaginationSchema = () => ({
	after: {
		...generateIdSchema().id,
		optional: true,
	},
	limit: {
		type: 'number',
		optional: true,
		convert: true,
		min: 1,
		max: PAGINATION_MAX_LIMIT,
		integer: true,
	},
});

exports.generateKeywordSchema = ({fieldName = 'keyword'} = {}) => ({
	[fieldName]: {
		type: 'string',
		optional: true,
		trim: true,
		max: 255,
	},
});
