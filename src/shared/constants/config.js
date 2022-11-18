const DEFAULT = {
	DATABASE_FILENAME: 'data.db',
};
const TEST = {
	DATABASE_FILENAME: 'data.test.db',
};

module.exports = process.env.NODE_ENV === 'test'
	? TEST
	: DEFAULT;
