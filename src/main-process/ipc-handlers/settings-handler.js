const {
	MAIN_SETTINGS_ID,
} = require('../../shared/constants/settings');
const SettingsModel = require('../models/data/settings-model');

exports.getSettings = async () => {
	const settings = await SettingsModel.findOne({where: {id: MAIN_SETTINGS_ID}});

	return {
		hasS3Settings: Boolean(settings?.accessKeyId),
	};
};
