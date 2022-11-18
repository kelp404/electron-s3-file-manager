const {contextBridge, ipcRenderer} = require('electron');
const {
	CONFIG: {GET_CONFIG},
} = require('../../shared/constants/ipc');
const {api, dialog} = require('./utils');

ipcRenderer.invoke(GET_CONFIG).then(config => {
	contextBridge.exposeInMainWorld('config', config);
});
contextBridge.exposeInMainWorld('dialog', dialog);
contextBridge.exposeInMainWorld('api', api);
