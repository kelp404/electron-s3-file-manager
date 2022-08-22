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

/**
 * @param {string} method
 * @param {Object} data
 * @returns {Promise<*>}
 */
const sendApiRequest = async ({method, data}) => {
	const [error, result] = await ipcRenderer.invoke(MAIN_API, {method, data});

	if (error) {
		throw error;
	}

	return result;
};

contextBridge.exposeInMainWorld('api', {
	getObjects(data) {
		return sendApiRequest({method: 'getObjects', data});
	},
	getObject(data) {
		return sendApiRequest({method: 'getObject', data});
	},
	createFolder(data) {
		return sendApiRequest({method: 'createFolder', data});
	},
	createFile(data) {
		return sendApiRequest({method: 'createFile', data});
	},
	deleteObjects(data) {
		return sendApiRequest({method: 'deleteObjects', data});
	},
	getSettings() {
		return sendApiRequest({method: 'getSettings'});
	},
	updateS3Settings(data) {
		return sendApiRequest({method: 'updateS3Settings', data});
	},
});
