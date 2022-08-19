const {validator} = require('.');
const {
	createFolderFormSchema,
} = require('../../shared/validation/form-schemas/object');

module.exports = {
	validateCreateFolderForm: validator.compile(createFolderFormSchema),
};
