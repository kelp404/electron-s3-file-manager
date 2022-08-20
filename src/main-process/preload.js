const {contextBridge, ipcRenderer} = require('electron');
const {
	MAIN_API, GET_CONFIG, SHOW_ERROR_BOX,
} = require('../shared/constants/ipc');

ipcRenderer.invoke(GET_CONFIG).then(config => {
	contextBridge.exposeInMainWorld('config', config);
});
contextBridge.exposeInMainWorld('dialog', {
	showErrorBox(title, content) {
		ipcRenderer.invoke(SHOW_ERROR_BOX, [title, content]);
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
