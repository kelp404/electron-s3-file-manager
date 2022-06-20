const React = require('react');
const Loading = require('./loading');
const S3Settings = require('./s3-settings');

const {api} = window;

module.exports = class Layout extends React.Component {
	state = {
		isShowS3Settings: false,
	};

	componentDidMount() {
		api.send({method: 'getSettings'})
			.then(({hasS3Settings}) => {
				this.setState({isShowS3Settings: !hasS3Settings});
			});
	}

	render() {
		const {isShowS3Settings} = this.state;

		if (isShowS3Settings) {
			return <S3Settings/>;
		}

		return <Loading/>;
	}
};
