const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');
const isDev = require('electron-is-dev');
const {
	BadRequestError,
} = require('../shared/errors');
const {
	MAIN_API,
	CONFIG: {GET_CONFIG},
	DIALOG: {SHOW_ERROR_BOX, SHOW_OPEN_DIALOG},
} = require('../shared/constants/ipc');
const {MAIN_SETTINGS_ID} = require('../shared/constants/settings');
const {connectDatabase, runMigrations} = require('./common/database');
const configHandler = require('./ipc-handlers/config-handler');
const dialogHandler = require('./ipc-handlers/dialog-handler');

try {
	require('electron-reload')(__dirname);
} catch {}

connectDatabase({isLogSQL: isDev});

function createWindow() {
	const mainWindow = new BrowserWindow({
		minWidth: 400,
		minHeight: 300,
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	if (isDev) {
		mainWindow.loadURL('http://localhost:3000/index.html');
		mainWindow.webContents.openDevTools();
	} else {
		mainWindow.loadFile('dist/renderer-process/index.html');
	}

	return mainWindow;
}

function generateIpcMainApiHandler() {
	const handlers = require('./ipc-handlers/main-api');

	return async (event, args = {}) => {
		const startTime = new Date();
		let error;

		try {
			const {method, data} = args;
			const handler = handlers[method];

			if (typeof handler !== 'function') {
				throw new BadRequestError(`not found "${method}"`);
			}

			const result = await handler({...data, $event: event});
			return [null, result];
		} catch (err) {
			error = err;
			return [
				typeof error.toJSON === 'function' ? error.toJSON() : error,
				null,
			];
		} finally {
			const processTimeInMillisecond = Date.now() - startTime;
			const processTime = `${processTimeInMillisecond}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

			console.log(
				`${MAIN_API} ${processTime.padStart(7)}ms ${`${args?.method}                              `.slice(0, 30)}`,
				{data: args?.data},
			);

			if (error) {
				console.error(error);
			}
		}
	};
}

ipcMain.handle(GET_CONFIG, configHandler.getConfig);
ipcMain.handle(SHOW_ERROR_BOX, dialogHandler.showErrorBox);
ipcMain.handle(SHOW_OPEN_DIALOG, dialogHandler.showOpenDialog);

app.whenReady().then(async () => {
	await runMigrations();

	const s3 = require('./common/s3');
	const SettingsModel = require('./models/data/settings-model');
	const settings = await SettingsModel.findOne({where: {id: MAIN_SETTINGS_ID}});

	s3.updateSettings(settings);
	ipcMain.handle(MAIN_API, generateIpcMainApiHandler());
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
