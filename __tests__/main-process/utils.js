const {ipcMain} = require('electron');
const {
	MAIN_API,
} = require('../../src/shared/constants/ipc');

exports.mockIpcMainApi = () => {
	const {
		generateIpcMainApiHandler,
	} = require('../../src/main-process/ipc-handlers/main-api');

	ipcMain.handle(MAIN_API, generateIpcMainApiHandler());
};
