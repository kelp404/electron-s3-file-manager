const {
	MAIN_SETTINGS_ID,
} = require('../../../shared/constants/settings');
const SettingsModel = require('../../models/data/settings-model');
const s3 = require('../../common/s3');

/**
 * @returns {Promise<null|SettingsModel>}
 */
exports.getSettings = async () => {
	const settings = await SettingsModel.findOne({where: {id: MAIN_SETTINGS_ID}});

	if (!settings) {
		return null;
	}

	return settings.toJSON();
};

/**
 * @param {string} accessKeyId
 * @param {string} secretAccessKey
 * @param {string} region
 * @param {string} bucket
 * @returns {Promise<SettingsModel>}
 */
exports.updateS3Settings = async ({accessKeyId, secretAccessKey, region, bucket} = {}) => {
	await SettingsModel.upsert(
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

	const settings = await SettingsModel.findOne({where: {id: MAIN_SETTINGS_ID}});

	s3.updateSettings(settings);
	return settings.toJSON();
};
