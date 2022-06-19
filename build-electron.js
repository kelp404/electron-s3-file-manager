const path = require('path');
const builder = require('electron-builder');

builder
	.build({
		projectDir: path.resolve(__dirname),
		win: ['portable'],
		mac: ['dmg'],
		config: {
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
