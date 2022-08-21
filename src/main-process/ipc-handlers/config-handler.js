const {nativeTheme} = require('electron');

exports.getConfig = () => ({
	shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
});
