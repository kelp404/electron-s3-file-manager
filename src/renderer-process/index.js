require('./stylesheets/index.scss');

const React = require('react');
const {createRoot} = require('react-dom/client');
const Layout = require('./components/layout');
const utils = require('./common/utils');

const {config} = window;

if (config.shouldUseDarkColors) {
	utils.loadStylesheet('dark-theme.css');
}

createRoot(document.getElementById('root')).render(<Layout/>);
