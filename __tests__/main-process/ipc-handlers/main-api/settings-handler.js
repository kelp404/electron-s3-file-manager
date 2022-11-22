const {
	api,
} = require('../../../../src/main-process/preload/utils');
const {
	AWS_CONFIG,
	mockIpcMainApi,
	cleanDatabase,
} = require('../../utils');

beforeAll(() => {
	mockIpcMainApi();
});

afterAll(async () => {
	await cleanDatabase();
});

describe('ipc main api settings handler', () => {
	test.concurrent('get initial s3 settings', async () => {
		const settings = await api.getSettings();

		expect(settings).toMatchSnapshot();
	});

	test.concurrent('update s3 settings', async () => {
		const settings = await api.updateS3Settings({
			accessKeyId: AWS_CONFIG.accessKeyId,
			secretAccessKey: AWS_CONFIG.secretAccessKey,
			region: AWS_CONFIG.region,
			bucket: AWS_CONFIG.bucket,
		});

		expect(settings).toMatchSnapshot({
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
		});
	});

	test.concurrent('get updated s3 settings', async () => {
		const settings = await api.getSettings();

		expect(settings).toMatchSnapshot({
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
		});
	});
});
