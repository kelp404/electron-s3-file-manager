# electron-s3-file-manager
A GUI AWS S3 file manager. It supports keyword search, download, upload and preview video.


## Development
### Generate dark theme stylesheet
Disable dark model then add darkreader into `renderer-process/index.js`.
```js
const darkreader = require('darkreader');

darkreader.enable({
	brightness: 100,
	contrast: 90,
	sepia: 10,
});

darkreader.exportGeneratedCSS().then(css => console.log(css));
```
