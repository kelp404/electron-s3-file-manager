const {ipcMain} = require('electron');
const {
	MAIN_API,
} = require('../../src/shared/constants/ipc');
const {
	generateIpcMainApiHandler,
} = require('../../src/main-process/ipc-handlers/main-api');

exports.mockIpcMainApi = () => {
	ipcMain.handle(MAIN_API, generateIpcMainApiHandler());
};
