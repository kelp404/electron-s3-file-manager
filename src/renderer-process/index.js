require('./stylesheets/index.scss');

const React = require('react');
const {createRoot} = require('react-dom/client');

const {environment: {versions}, api} = window;

class Test extends React.Component {
	state = {
		result: '',
	};

	componentDidMount() {
		api.send({method: 'getSettings', data: {test: 1}})
			.then(result => {
				this.setState({result: JSON.stringify(result, null, 2)});
			});
	}

	render() {
		const {result} = this.state;

		return <pre><code>{result}</code></pre>;
	}
}

createRoot(document.getElementById('root')).render(
	<div>
		<p>
			We are using Node.js {versions.node}, Chromium {versions.chrome}, and Electron {versions.electron}
		</p>
		<Test/>
	</div>,
);
