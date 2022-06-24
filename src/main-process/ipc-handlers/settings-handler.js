const {
	MAIN_SETTINGS_ID,
} = require('../../shared/constants/settings');
const SettingsModel = require('../models/data/settings-model');

exports.getSettings = async () => {
	const settings = await SettingsModel.findOne({where: {id: MAIN_SETTINGS_ID}});

	if (!settings) {
		return null;
	}

	return settings.toJSON();
};

exports.updateS3Settings = async ({accessKeyId, secretAccessKey, region, bucket}) => {
	await SettingsModel.upsert(
		{
			id: MAIN_SETTINGS_ID,
			accessKeyId,
			secretAccessKey,
			region,
			bucket,
		},
		{
			updateOnDuplicate: [
				'accessKeyId',
				'secretAccessKey',
				'region',
				'bucket',
				'cryptoIv',
				'updatedAt',
			],
		},
	);
};