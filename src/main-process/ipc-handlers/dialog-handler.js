const {dialog} = require('electron');

exports.showErrorBox = (event, [title, content]) => {
	dialog.showErrorBox(title, content);
};

exports.showOpenDialog = async (event, options) => {
	const result = await dialog.showOpenDialog(options);

	if (result.canceled) {
		return result;
	}

	return result;
};
