const classnames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const {
	NAVIGATION_TABS,
	STORE_KEYS,
} = require('../common/constants');
const store = require('../common/store');

module.exports = class Navigation extends React.PureComponent {
	static propTypes = {
		currentTab: PropTypes.oneOf(Object.values(NAVIGATION_TABS)),
	};

	static defaultProps = {
		currentTab: null,
	};

	onClickTab(event) {
		store.set(STORE_KEYS.CURRENT_NAVIGATION_TAB, event.target.dataset.tabName);
	}

	render() {
		const {currentTab} = this.props;

		return (
			<nav className="sticky-top">
				<div className="nav nav-tabs px-2">
					<button
						data-tab-name={NAVIGATION_TABS.OBJECTS}
						className={classnames(
							'nav-link rounded-0',
							{active: currentTab === NAVIGATION_TABS.OBJECTS},
						)}
						style={{borderBottomColor: 'transparent'}}
						type="button"
						onClick={this.onClickTab}
					>
						Objects
					</button>
					<button
						data-tab-name={NAVIGATION_TABS.SETTINGS}
						className={classnames(
							'nav-link rounded-0',
							{active: currentTab === NAVIGATION_TABS.SETTINGS},
						)}
						style={{borderBottomColor: 'transparent'}}
						type="button"
						onClick={this.onClickTab}
					>
						Settings
					</button>
				</div>
			</nav>
		);
	}
};
