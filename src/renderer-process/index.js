require('./stylesheets/index.scss');

const React = require('react');
const {createRoot} = require('react-dom/client');
const Layout = require('./components/layout');

createRoot(document.getElementById('root')).render(<Layout/>);
