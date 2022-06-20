const {contextBridge, ipcRenderer} = require('electron');
const {
	MAIN_API,
} = require('../shared/constants/ipc');

contextBridge.exposeInMainWorld('api', {
	send: ({method, data}) => ipcRenderer.invoke(MAIN_API, {method, data}),
});
