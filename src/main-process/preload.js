const {contextBridge} = require('electron');

contextBridge.exposeInMainWorld('environment', {
	versions: process.versions,
});
