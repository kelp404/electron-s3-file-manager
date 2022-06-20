const {validator} = require('.');
const {
	updateS3SettingsFormSchema,
} = require('../../shared/validation/form-schemas/settings');

module.exports = {
	validateUpdateS3SettingsForm: validator.compile(updateS3SettingsFormSchema),
};
