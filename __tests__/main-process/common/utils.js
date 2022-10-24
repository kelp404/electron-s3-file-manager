const utils = require('../../../src/main-process/common/utils');

describe('encrypt', () => {
	test('encrypt string with iv', () => {
		const result = utils.encrypt({
			value: Buffer.from('test value'),
			iv: Buffer.from('31682eec1f9655da345101e94ca741ba', 'hex'),
		});

		expect(result.toString('hex')).toMatchSnapshot();
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

describe('decrypt', () => {
	test('decrypt string with iv', () => {
		const result = utils.decrypt({
			value: Buffer.from('8595b720aebb469f8ce1cb1c5982a813', 'hex'),
			iv: Buffer.from('31682eec1f9655da345101e94ca741ba', 'hex'),
		});

		expect(result.toString()).toMatchSnapshot();
	});

	test('encrypt string with invalid iv', () => {
		expect(() => {
			utils.decrypt({
				value: Buffer.from('8595b720aebb469f8ce1cb1c5982a813', 'hex'),
				iv: Buffer.from('31682eec1f9655da345101e94ca741', 'hex'),
			});
		}).toThrow('Invalid initialization vector');
	});
});

describe('parse keyword', () => {
	test('parse keyword', () => {
		const keywords = utils.parseKeyword('car "apple pencil" -amd uId:1024 aId: 2048');

		expect(keywords).toMatchSnapshot();
	});
});
