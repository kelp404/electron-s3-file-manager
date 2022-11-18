const {mockIpcMainApi} = require('../../utils');
const {
	api,
} = require('../../../../src/main-process/preload/utils');

beforeAll(() => {
	mockIpcMainApi();
});

describe('ipc main api settings handler', () => {
	test('get initial s3 settings', async () => {
		const settings = await api.getSettings();

		expect(settings).toMatchSnapshot();
	});
});
