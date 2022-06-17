const path = require('path');
const builder = require('electron-builder');

builder
	.build({
		projectDir: path.resolve(__dirname),
		win: ['portable'],
		mac: ['dmg'],
		config: {
			appId: 'io.github.kelp404.electron-s3-file-manager',
			productName: 'Electron S3 File Manager',
			copyright: 'Copyright © 2022 kelp404',
			directories: {
				output: 'dist',
			},
			files: [
				'package.json',
				'dist/main-process/**/*',
				'dist/renderer-process/**/*',
			],
			extends: null,
		},
	})
	.then(console.log)
	.catch(console.error);
