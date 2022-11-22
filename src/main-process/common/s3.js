const {Op} = require('sequelize');
const {
	DeleteObjectsCommand,
	GetObjectCommand,
	HeadObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	S3Client,
} = require('@aws-sdk/client-s3');
const {
	getSignedUrl,
} = require('@aws-sdk/s3-request-presigner');
const {
	Upload,
} = require('@aws-sdk/lib-storage');
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
			result.Contents
				? ObjectModel.bulkCreate(
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
				)
				: null,
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
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/getobjectcommand.html
 * @param {string} path
 * @returns {Promise<GetObjectCommandOutput>}
 */
exports.getObject = path => {
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

	return client.send(getObjectCommand);
};

/**
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/putobjectcommand.html
 * @param {string} path
 * @param {Object} options
 * @returns {Promise<PutObjectCommandOutput>}
 */
exports.putObject = (path, options = {}) => {
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
		...(options.Body == null ? {Body: null, ContentLength: 0} : {}),
	});

	return client.send(putObjectCommand);
};

/**
 * @param {string} path
 * @param {Buffer|Stream} content
 * @param {Object} options
 * @param {function({Bucket: string, Key: string, loaded: number, part: number, total: number})} onProgress
 * @returns {Promise<CompleteMultipartUploadCommandOutput | AbortMultipartUploadCommandOutput>}
 */
exports.upload = ({path, content, options, onProgress}) => {
	const client = new S3Client({
		region: settings.region,
		credentials: {
			accessKeyId: settings.accessKeyId,
			secretAccessKey: settings.secretAccessKey,
		},
	});
	const upload = new Upload({
		client,
		params: {
			...options,
			Bucket: settings.bucket,
			Key: path,
			Body: content,
		},
	});

	if (onProgress) {
		upload.on('httpUploadProgress', onProgress);
	}

	return upload.done();
};

/**
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/deleteobjectscommand.html
 * @param {Array<string>} paths
 * @returns {Promise<DeleteObjectsCommandOutput>}
 */
exports.deleteObjects = paths => {
	const client = new S3Client({
		region: settings.region,
		credentials: {
			accessKeyId: settings.accessKeyId,
			secretAccessKey: settings.secretAccessKey,
		},
	});
	const deleteObjectsCommand = new DeleteObjectsCommand({
		Bucket: settings.bucket,
		Delete: {
			Objects: paths.map(path => ({Key: path})),
		},
	});

	return client.send(deleteObjectsCommand);
};
