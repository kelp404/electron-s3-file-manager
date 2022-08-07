const React = require('react');
const {
	NAVIGATION_TABS,
	STORE_KEYS,
} = require('../common/constants');
const store = require('../common/store');
const Base = require('./shared/base');
const Loading = require('./shared/loading');
const Navigation = require('./navigation');
const Objects = require('./objects');
const S3Settings = require('./s3-settings');

const {api} = window;

module.exports = class Layout extends Base {
	constructor(props) {
		super(props);
		this.state.currentNavigationTab = null;
		this.state.objects = null;
	}

	async componentDidMount() {
		super.componentDidMount();
		this.$listens.push(
			store.subscribe(STORE_KEYS.CURRENT_NAVIGATION_TAB, (_, currentNavigationTab) => {
				this.setState({currentNavigationTab});
			}),
		);

		const settings = await api.send({method: 'getSettings'});
		const hasAccessKeyId = Boolean(settings?.accessKeyId);

		store.set(STORE_KEYS.SETTINGS, settings);
		store.set(
			STORE_KEYS.CURRENT_NAVIGATION_TAB,
			hasAccessKeyId ? NAVIGATION_TABS.OBJECTS : NAVIGATION_TABS.SETTINGS,
		);

		if (hasAccessKeyId) {
			const objects = await api.send({
				method: 'getObjects',
			});

			this.setState({objects});
		}
	}

	renderContent() {
		const {currentNavigationTab, objects} = this.state;

		if (currentNavigationTab === NAVIGATION_TABS.SETTINGS) {
			return <S3Settings/>;
		}

		if (objects == null) {
			return (
				<div className="row">
					<div className="col-12 d-flex flex-column justify-content-center">
						<Loading/>
					</div>
				</div>
			);
		}

		return <Objects objects={objects}/>;
	}

	render() {
		const {currentNavigationTab} = this.state;

		return (
			<>
				<Navigation currentTab={currentNavigationTab}/>
				<div className="container-fluid py-3" style={{minHeight: 'calc(100vh - 50px)'}}>
					{this.renderContent()}
				</div>
			</>
		);
	}
};
