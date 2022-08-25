# electron-s3-file-manager
A GUI AWS S3 file manager. It supports keyword search, download, upload and preview video.


![search](_screenshot/details.png)

## Installation
[Go to release page.](https://github.com/kelp404/electron-s3-file-manager/releases)


## Amazon S3 pricing
https://aws.amazon.com/s3/pricing/


## Create AWS S3 bucket
This project uses Access Key to access your S3 bucket, so enable "Block all public access" is ok.  
https://aws.amazon.com/getting-started/hands-on/backup-files-to-amazon-s3/


## Create access key
https://objectivefs.com/howto/how-to-get-amazon-s3-keys

Ths policy example:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket",
                "arn:aws:s3:::your-bucket/*"
            ],
            "Condition": {
                "ForAnyValue:IpAddress": {
                    "aws:SourceIp": [
                        "0.0.0.0/0"
                    ]
                }
            }
        }
    ]
}
```
You can set ip whitelist at "aws:SourceIp".


## Development
### Run in development mode
```bash
git clone https://github.com/kelp404/electron-s3-file-manager.git
cd electron-s3-file-manager
npm install
npm start
```

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

### Make database schema migration
#### 1. Update models at `src/main-process/models/data/*.js`
#### 2. Make migration script
```bash
npm run makemigration
```

### Run database schema migration scripts
```bash
npm run runmigration
```
