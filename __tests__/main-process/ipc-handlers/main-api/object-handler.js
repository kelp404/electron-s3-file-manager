const https = require('https');
const path = require('path');
const {
	api,
} = require('../../../../src/main-process/preload/utils');
const {
	AWS_CONFIG,
	mockIpcMainApi,
	setS3Settings,
	cleanDatabase,
} = require('../../utils');

let image;

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
			id: expect.any(Number),
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
		});
	});

	test.concurrent('create image file', async () => {
		const onProgress = jest.fn();

		image = await api.createFile({
			onProgress,
			localPath: path.join(__dirname, '..', '..', 'resources', 'image.png'),
			dirname: 'folder',
		});

		expect(image).toMatchSnapshot({
			id: expect.any(Number),
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
			lastModified: expect.any(Date),
		});
		expect(onProgress).toBeCalledWith(
			expect.objectContaining({}),
			{
				Bucket: AWS_CONFIG.bucket,
				Key: 'folder/image.png',
				loaded: 107,
				part: 1,
				total: 107,
			},
		);
	});

	test.concurrent('get image file', async () => {
		const object = await api.getObject({id: image.id});

		expect(object).toMatchSnapshot({
			id: expect.any(Number),
			url: expect.any(String),
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
			lastModified: expect.any(Date),
			objectHeaders: {
				$metadata: {
					extendedRequestId: expect.any(String),
				},
				Expiration: expect.any(String),
				LastModified: expect.any(Date),
			},
		});

		await new Promise((resolve, reject) => {
			const req = https.get(object.url, response => {
				expect(response.statusCode).toEqual(200);
				expect(response.headers).toMatchSnapshot({
					date: expect.any(String),
					'last-modified': expect.any(String),
					'x-amz-expiration': expect.any(String),
					'x-amz-id-2': expect.any(String),
					'x-amz-request-id': expect.any(String),
				});
				resolve();
			});

			req.on('error', error => {
				reject(error);
			});
		});
	});
});
