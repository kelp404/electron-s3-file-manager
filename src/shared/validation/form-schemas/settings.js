const settingsSchema = require('../model-schemas/settings');

exports.updateS3SettingsFormSchema = {
	accessKeyId: settingsSchema.accessKeyId,
	secretAccessKey: settingsSchema.secretAccessKey,
	region: settingsSchema.region,
	bucket: settingsSchema.bucket,
};
