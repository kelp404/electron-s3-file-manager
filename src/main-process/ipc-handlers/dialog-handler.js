const fs = require('fs');
const path = require('path');
const {dialog} = require('electron');

exports.showErrorBox = (event, [title, content]) => {
	dialog.showErrorBox(title, content);
};

exports.showOpenDialog = async (event, options) => {
	const result = await dialog.showOpenDialog(options);

	if (result.canceled) {
		result.files = [];
		delete result.filePaths;
		return result;
	}

	result.files = result.filePaths.map(filePath => ({
		path: filePath,
		name: path.basename(filePath),
		size: fs.statSync(filePath).size,
	}));
	delete result.filePaths;
	return result;
};
