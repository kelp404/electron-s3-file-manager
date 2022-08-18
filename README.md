# electron-s3-file-manager
A GUI AWS S3 file manager. It supports keyword search, download, upload and preview video.


## Development
### Generate dark theme stylesheet
#### 1. Disable dark mode.
Remove `utils.loadStylesheet('dark-theme.css');` at `render-process/index.js`.

#### 2. Add darkreader at `renderer-process/index.js`.
```js
const darkreader = require('darkreader');

darkreader.enable({
	brightness: 100,
	contrast: 90,
	sepia: 10,
});
darkreader.exportGeneratedCSS().then(console.log);
```
