const React = require('react');
const {
	NAVIGATION_TABS,
	STORE_KEYS,
} = require('../common/constants');
const store = require('../common/store');
const Base = require('./shared/base');
const Loading = require('./shared/loading');
const Navigation = require('./navigation');
const S3Settings = require('./s3-settings');

const {api} = window;

module.exports = class Layout extends Base {
	constructor(props) {
		super(props);
		this.state.currentNavigationTab = null;
	}

	componentDidMount() {
		super.componentDidMount();
		this.$listens.push(
			store.subscribe(STORE_KEYS.CURRENT_NAVIGATION_TAB, (_, currentNavigationTab) => {
				this.setState({currentNavigationTab});
			}),
		);

		api.send({method: 'getSettings'})
			.then(settings => {
				store.set(
					STORE_KEYS.CURRENT_NAVIGATION_TAB,
					settings?.accessKeyId ? NAVIGATION_TABS.OBJECTS : NAVIGATION_TABS.SETTINGS,
				);
			});
	}

	renderContent() {
		const {currentNavigationTab} = this.state;

		if (currentNavigationTab === NAVIGATION_TABS.SETTINGS) {
			return <S3Settings/>;
		}

		return (
			<div className="row">
				<div
					className="col-12 d-flex flex-column justify-content-center"
					style={{minHeight: 'calc(100vh - 60px)'}}
				>
					<Loading/>
				</div>
			</div>
		);
	}

	render() {
		const {currentNavigationTab} = this.state;

		return (
			<div className="container-fluid">
				<Navigation currentTab={currentNavigationTab}/>
				{this.renderContent()}
			</div>
		);
	}
};
