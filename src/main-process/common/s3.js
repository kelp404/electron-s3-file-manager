const {
	S3Client,
	HeadObjectCommand,
} = require('@aws-sdk/client-s3');

let settings;

/**
 * @param {SettingsModel} value
 * @returns {undefined}
 */
exports.updateSettings = value => {
	settings = value;
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
