const {contextBridge, ipcRenderer} = require('electron');
const {
	MAIN_API, GET_CONFIG,
} = require('../shared/constants/ipc');

ipcRenderer.invoke(GET_CONFIG).then(config => {
	contextBridge.exposeInMainWorld('config', config);
});
contextBridge.exposeInMainWorld('api', {
	send: ({method, data}) => ipcRenderer.invoke(MAIN_API, {method, data}),
});
