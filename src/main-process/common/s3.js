const {Op} = require('sequelize');
const {
	S3Client,
	GetObjectCommand,
	HeadObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
} = require('@aws-sdk/client-s3');
const {
	getSignedUrl,
} = require('@aws-sdk/s3-request-presigner');
const OBJECT_TYPE = require('../../shared/constants/object-type');
const ObjectModel = require('../models/data/object-model');

let settings;

/**
 * @param {SettingsModel} value
 * @returns {undefined}
 */
exports.updateSettings = value => {
	settings = value;
};

/**
 * Sync all objects on S3 to local database.
 * @returns {Promise<void>}
 */
exports.syncObjectsFromS3 = async () => {
	const start = new Date();
	const client = new S3Client({
		region: settings.region,
		credentials: {
			accessKeyId: settings.accessKeyId,
			secretAccessKey: settings.secretAccessKey,
		},
	});
	const scanObjects = async continuationToken => {
		const pathSet = new Set();
		const result = await client.send(new ListObjectsV2Command({
			Bucket: settings.bucket,
			ContinuationToken: continuationToken,
		}));
		const convertS3Object = ({Key, Size, LastModified, StorageClass}) => ({
			type: Key.slice(-1) === '/' ? OBJECT_TYPE.FOLDER : OBJECT_TYPE.FILE,
			path: Key,
			lastModified: LastModified,
			size: Size,
			storageClass: StorageClass,
		});

		await Promise.all([
			ObjectModel.bulkCreate(
				result.Contents
					.map(content => {
						const pieces = content.Key.split('/').slice(0, -1);

						return [
							convertS3Object(content),
							...pieces.map((piece, index) => convertS3Object({
								Key: `${pieces.slice(0, index + 1).join('/')}/`,
							})),
						];
					})
					.flat()
					.filter(object => {
						if (object.type === OBJECT_TYPE.FILE) {
							pathSet.add(object.path);
							return true;
						}

						if (pathSet.has(object.path)) {
							return false;
						}

						pathSet.add(object.path);
						return true;
					}),
				{updateOnDuplicate: ['type', 'lastModified', 'size', 'updatedAt', 'storageClass']},
			),
			result.NextContinuationToken ? scanObjects(result.NextContinuationToken) : null,
		]);
	};

	await scanObjects();

	// Remove missing objects.
	await ObjectModel.destroy({
		where: {updatedAt: {[Op.lt]: start}},
	});
};

/**
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/headobjectcommand.html
 * @param {string} path
 * @param {Object} options
 * @returns {Promise<HeadObjectCommandOutput>}
 */
exports.headObject = (path, options) => {
	const client = new S3Client({
		region: settings.region,
		credentials: {
			accessKeyId: settings.accessKeyId,
			secretAccessKey: settings.secretAccessKey,
		},
	});
	const headObjectCommand = new HeadObjectCommand({
		...options,
		Bucket: settings.bucket,
		Key: path,
	});

	return client.send(headObjectCommand);
};

/**
 * @param {string} path
 * @param {number} expiresIn - Expires in seconds. Default is 24 hours.
 * @returns {Promise<string>}
 */
exports.getSignedUrl = (path, {expiresIn = 24 * 60 * 60} = {}) => {
	const client = new S3Client({
		region: settings.region,
		credentials: {
			accessKeyId: settings.accessKeyId,
			secretAccessKey: settings.secretAccessKey,
		},
	});
	const getObjectCommand = new GetObjectCommand({
		Bucket: settings.bucket,
		Key: path,
	});

	return getSignedUrl(client, getObjectCommand, {expiresIn});
};

/**
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/putobjectcommand.html
 * @param {string} path
 * @param {Object} options
 * @returns {Promise<PutObjectCommandOutput>}
 */
exports.putObject = (path, options) => {
	const client = new S3Client({
		region: settings.region,
		credentials: {
			accessKeyId: settings.accessKeyId,
			secretAccessKey: settings.secretAccessKey,
		},
	});
	const putObjectCommand = new PutObjectCommand({
		...options,
		Bucket: settings.bucket,
		Key: path,
	});

	return client.send(putObjectCommand);
};
