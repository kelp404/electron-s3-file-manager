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
	const settings = await SettingsModel.upsert(
		{
			id: MAIN_SETTINGS_ID,
			accessKeyId,
			region,
			bucket,
			...secretAccessKey ? {secretAccessKey} : {},
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

	return settings[0].toJSON();
};
