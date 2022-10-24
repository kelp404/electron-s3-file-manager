const utils = require('../../../src/main-process/common/utils');

describe('encrypt', () => {
	test('encrypt string with iv', () => {
		const result = utils.encrypt({
			value: Buffer.from('test value'),
			iv: Buffer.from('31682eec1f9655da345101e94ca741ba', 'hex'),
		});

		expect(result).toMatchSnapshot();
	});

	test('encrypt string with invalid iv', () => {
		expect(() => {
			utils.encrypt({
				value: Buffer.from('test value'),
				iv: Buffer.from('31682eec1f9655da345101e94ca741', 'hex'),
			});
		}).toThrow('Invalid initialization vector');
	});
});
