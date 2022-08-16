require('./stylesheets/index.scss');

const dayjs = require('dayjs');
const LocalizedFormat = require('dayjs/plugin/localizedFormat');
const React = require('react');
const {createRoot} = require('react-dom/client');
const Layout = require('./components/layout');
const utils = require('./common/utils');

const {config} = window;

dayjs.extend(LocalizedFormat);

if (config.shouldUseDarkColors) {
	utils.loadStylesheet('dark-theme.css');
}

createRoot(document.getElementById('root')).render(<Layout/>);
