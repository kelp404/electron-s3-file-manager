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
	test.concurrent('sync objects from s3', async () => {
		await api.syncObjectsFromS3();
	});

	test.concurrent('delete all objects', async () => {
		const objects = await api.getObjects({limit: 500});
		const objectIds = objects.items.map(object => object.id);

		await api.deleteObjects({ids: objectIds});
	});

	test.concurrent('create folder', async () => {
		const object = await api.createFolder({basename: 'folder'});

		expect(object).toMatchSnapshot({
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
		});
	});
});
