const React = require('react');
const {
	NAVIGATION_TABS,
	STORE_KEYS,
} = require('../common/constants');
const store = require('../common/store');
const Base = require('./shared/base');
const Loading = require('./shared/loading');
const Navigation = require('./navigation');
const Objects = require('./objects/objects');
const Settings = require('./settings/settings');

const {api} = window;

module.exports = class Layout extends Base {
	constructor(props) {
		super(props);
		this.state.currentNavigationTab = null;
		this.state.objects = null;
	}

	async componentDidMount() {
		super.componentDidMount();

		const settings = await api.getSettings();
		const hasAccessKeyId = Boolean(settings?.accessKeyId);
		const currentNavigationTab = hasAccessKeyId ? NAVIGATION_TABS.OBJECTS : NAVIGATION_TABS.SETTINGS;

		store.set(STORE_KEYS.SETTINGS, settings);
		store.set(STORE_KEYS.CURRENT_NAVIGATION_TAB, currentNavigationTab);
		this.setState({currentNavigationTab});
		this.$listens.push(
			store.subscribe(STORE_KEYS.CURRENT_NAVIGATION_TAB, async (_, currentNavigationTab) => {
				let objects;

				if (currentNavigationTab === NAVIGATION_TABS.OBJECTS) {
					if (store.get(STORE_KEYS.SETTINGS)?.accessKeyId) {
						objects = await api.getObjects();
					} else {
						objects = {hasNextPage: false, items: []};
					}
				}

				this.setState({currentNavigationTab, objects});
			}),
		);

		if (hasAccessKeyId) {
			const objects = await api.getObjects();

			this.setState({objects});
		} else {
			this.setState({objects: {hasNextPage: false, items: []}});
		}
	}

	renderContent() {
		const {currentNavigationTab, objects} = this.state;

		if (currentNavigationTab === NAVIGATION_TABS.SETTINGS) {
			return <Settings/>;
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
