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
	send: ({method, data}) => ipcRenderer.invoke(MAIN_API, {method, data}),
});
