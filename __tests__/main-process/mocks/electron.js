const createIPCMock = require('electron-mock-ipc').default;

const mocked = createIPCMock();

module.exports = {
	ipcMain: mocked.ipcMain,
	ipcRenderer: mocked.ipcRenderer,
};
