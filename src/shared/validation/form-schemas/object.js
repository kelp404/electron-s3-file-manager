const objectSchema = require('../model-schemas/object');

exports.createFolderFormSchema = {
	dirname: objectSchema.dirname,
	basename: objectSchema.basename,
};
