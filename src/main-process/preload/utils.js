const {ipcRenderer} = require('electron');
const {
	MAIN_API,
	DIALOG: {SHOW_ERROR_BOX, SHOW_OPEN_DIALOG},
} = require('../../shared/constants/ipc');

/**
 * @param {string} method
 * @param {Object} data
 * @returns {Promise<*>}
 */
async function sendApiRequest({method, data}) {
	const [error, result] = await ipcRenderer.invoke(MAIN_API, {method, data});

	if (error) {
		throw error;
	}

	return result;
}

exports.dialog = {
	showErrorBox(title, content) {
		ipcRenderer.invoke(SHOW_ERROR_BOX, [title, content]);
	},
	showOpenDialog(options) {
		return ipcRenderer.invoke(SHOW_OPEN_DIALOG, options);
	},
};

exports.api = {
	/**
	 * @param {{dirname, keyword, after, limit}} data
	 * @returns {Promise<{
	 * 	hasNextPage,
	 * 	items: Array<{id, type, path, basename, dirname, updatedAt, createdAt}>,
	 * }>}
	 */
	getObjects(data) {
		return sendApiRequest({method: 'getObjects', data});
	},
	getObject(data) {
		return sendApiRequest({method: 'getObject', data});
	},
	/**
	 * @param {{dirname: (null|string), basename: string}} data
	 * @returns {Promise<{id, type, path, basename, dirname, updatedAt, createdAt}>}
	 */
	createFolder(data) {
		return sendApiRequest({method: 'createFolder', data});
	},
	/**
	 * @param {function(event, {Bucket: string, Key: string, loaded: number, part: number, total: number})} onProgress
	 * @param {{localPath: string, dirname: string}} data
	 * @returns {Promise<ObjectModel>}
	 */
	async createFile({onProgress, ...data} = {}) {
		const id = Math.random().toString(36);
		const channel = `createFile.onProgress:${id}`;

		try {
			if (typeof onProgress === 'function') {
				ipcRenderer.on(channel, onProgress);
			}

			return await sendApiRequest({
				method: 'createFile',
				data: {...data, onProgressChannel: channel},
			});
		} finally {
			if (typeof onProgress === 'function') {
				ipcRenderer.off(channel, onProgress);
			}
		}
	},
	/**
	 * @param {function(event, {basename: string, total: number, loaded: number})} onProgress
	 * @param {{localPath: string, dirname: string, ids: Array<number>}} data
	 * @returns {Promise<*>}
	 */
	async downloadObjects({onProgress, ...data} = {}) {
		const id = Math.random().toString(36);
		const channel = `downloadObjects.onProgress:${id}`;

		try {
			if (typeof onProgress === 'function') {
				ipcRenderer.on(channel, onProgress);
			}

			return await sendApiRequest({
				method: 'downloadObjects',
				data: {...data, onProgressChannel: channel},
			});
		} finally {
			if (typeof onProgress === 'function') {
				ipcRenderer.off(channel, onProgress);
			}
		}
	},
	/**
	 * @param {{ids: Array<number>}} data
	 * @returns {Promise<null>}
	 */
	deleteObjects(data) {
		return sendApiRequest({method: 'deleteObjects', data});
	},
	/**
	 * @returns {Promise<null|{id, accessKeyId, bucket, region, updatedAt, createdAt}>}
	 */
	getSettings() {
		return sendApiRequest({method: 'getSettings'});
	},
	/**
	 * @param {{accessKeyId: string, secretAccessKey: string, region: string, bucket: string}} data
	 * @returns {Promise<{id, accessKeyId, bucket, region, updatedAt, createdAt}>}
	 */
	updateS3Settings(data) {
		return sendApiRequest({method: 'updateS3Settings', data});
	},
	/**
	 * @returns {Promise<null>}
	 */
	syncObjectsFromS3() {
		return sendApiRequest({method: 'syncObjectsFromS3'});
	},
};
