const path = require('path');
const {app, BrowserWindow} = require('electron');
const isDev = require('electron-is-dev');

function createWindow() {
	const mainWindow = new BrowserWindow({
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
}

app.whenReady().then(() => {
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
