require('dotenv').config();
const pLimit = require('p-limit');
const {ipcMain} = require('electron');
const {
	MAIN_API,
} = require('../../src/shared/constants/ipc');
const {
	api,
} = require('../../src/main-process/preload/utils');

const AWS_CONFIG = {
	accessKeyId: process.env.S3_ACCESS_KEY_ID,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	region: 'us-west-2',
	bucket: 'integration-testing-or',
};

exports.AWS_CONFIG = AWS_CONFIG;

exports.mockIpcMainApi = () => {
	const {
		generateIpcMainApiHandler,
	} = require('../../src/main-process/ipc-handlers/main-api');

	ipcMain.handle(MAIN_API, generateIpcMainApiHandler());
};

exports.setS3Settings = async () => api.updateS3Settings({
	accessKeyId: AWS_CONFIG.accessKeyId,
	secretAccessKey: AWS_CONFIG.secretAccessKey,
	region: AWS_CONFIG.region,
	bucket: AWS_CONFIG.bucket,
});

exports.cleanDatabase = async () => {
	const models = require('../../src/main-process/models/data');
	const limit = pLimit(1);

	return Promise.all(
		Object.values(models.sequelize.models)
			.map(model => limit(() => model.destroy({where: {}}))),
	);
};
