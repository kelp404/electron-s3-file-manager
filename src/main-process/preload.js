const {contextBridge, ipcRenderer} = require('electron');
const {
	MAIN_API,
	CONFIG: {GET_CONFIG},
	DIALOG: {SHOW_ERROR_BOX, SHOW_OPEN_DIALOG},
} = require('../shared/constants/ipc');

ipcRenderer.invoke(GET_CONFIG).then(config => {
	contextBridge.exposeInMainWorld('config', config);
});
contextBridge.exposeInMainWorld('dialog', {
	showErrorBox(title, content) {
		ipcRenderer.invoke(SHOW_ERROR_BOX, [title, content]);
	},
	showOpenDialog(options) {
		return ipcRenderer.invoke(SHOW_OPEN_DIALOG, options);
	},
});
contextBridge.exposeInMainWorld('api', {
	async send({method, data}) {
		const [error, result] = await ipcRenderer.invoke(MAIN_API, {method, data});

		if (error) {
			throw error;
		}

		return result;
	},
});
