const settingsSchema = require('../model-schemas/settings');

exports.setupS3SettingsFormSchema = {
	accessKeyId: settingsSchema.accessKeyId,
	secretAccessKey: settingsSchema.secretAccessKey,
	region: settingsSchema.region,
	bucket: settingsSchema.bucket,
	endpoint: settingsSchema.endpoint,
};

exports.updateS3SettingsFormSchema = {
	accessKeyId: settingsSchema.accessKeyId,
	secretAccessKey: {
		...settingsSchema.secretAccessKey,
		optional: true,
		empty: true,
	},
	region: settingsSchema.region,
	bucket: settingsSchema.bucket,
	endpoint: {
		...settingsSchema.endpoint,
		optional: true,
		empty: true,
	},
};
