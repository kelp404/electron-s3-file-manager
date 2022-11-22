const {
	api,
} = require('../../../../src/main-process/preload/utils');
const {
	mockIpcMainApi,
	setS3Settings,
	cleanDatabase,
} = require('../../utils');

beforeAll(async () => {
	mockIpcMainApi();
	await setS3Settings();
});

afterAll(async () => {
	await cleanDatabase();
});

describe('ipc main api object handler', () => {
	test.concurrent('create folder', async () => {
		const object = await api.createFolder({basename: 'folder'});

		expect(object).toMatchSnapshot({
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
		});
	});
});
