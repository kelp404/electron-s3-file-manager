const React = require('react');
const {createRoot} = require('react-dom/client');

const {versions} = window.environment;

createRoot(document.getElementById('root')).render(
	<p>
		We are using Node.js {versions.node}, Chromium {versions.chrome}, and Electron {versions.electron}
	</p>,
);
