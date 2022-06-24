const {validator} = require('.');
const {
	setupS3SettingsFormSchema,
	updateS3SettingsFormSchema,
} = require('../../shared/validation/form-schemas/settings');

module.exports = {
	validateSetupS3SettingsForm: validator.compile(setupS3SettingsFormSchema),
	validateUpdateS3SettingsForm: validator.compile(updateS3SettingsFormSchema),
};
