const {
	api,
} = require('../../../../src/main-process/preload/utils');
const {mockIpcMainApi} = require('../../utils');

beforeAll(() => {
	mockIpcMainApi();
});

describe('ipc main api settings handler', () => {
	test('get initial s3 settings', async () => {
		console.log('start ----------------- getSettings', new Date());
		const settings = await api.getSettings();

		expect(settings).toMatchSnapshot();
	});
});
