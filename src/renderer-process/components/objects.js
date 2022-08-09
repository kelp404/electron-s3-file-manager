const PropTypes = require('prop-types');
const React = require('react');
const OBJECT_TYPE = require('../../shared/constants/object-type');
const STORAGE_CLASS = require('../../shared/constants/storage-class');
const utils = require('../common/utils');
const store = require('../common/store');
const {STORE_KEYS} = require('../common/constants');
const Base = require('./shared/base');

module.exports = class S3Settings extends Base {
	static propTypes = {
		objects: PropTypes.shape({
			items: PropTypes.arrayOf(PropTypes.shape({
				id: PropTypes.number.isRequired,
				type: PropTypes.oneOf(Object.values(OBJECT_TYPE)).isRequired,
				path: PropTypes.string.isRequired,
				dirname: PropTypes.string.isRequired,
				basename: PropTypes.string.isRequired,
				lastModified: utils.generateDatePropTypes({isRequired: false}),
				size: PropTypes.number,
				storageClass: PropTypes.oneOf(Object.keys(STORAGE_CLASS)),
			}).isRequired).isRequired,
		}),
	};

	constructor(props) {
		super(props);

		const settings = store.get(STORE_KEYS.SETTINGS);

		this.state.keyword = '';
		this.state.breadcrumb = {
			items: [
				{
					id: Math.random().toString(36),
					title: settings.bucket,
					urlParams: {dirname: null},
				},
			],
		};
	}

	onClickSearchButton = event => {
		event.preventDefault();
		// Todo: search objects
	};

	onChangeKeyword = event => {
		this.setState({keyword: event.target.value});
	};

	render() {
		const {breadcrumb, keyword} = this.state;

		return (
			<div className="row">
				<div className="col-12">
					<div className="d-flex align-items-center justify-content-between mb-3">
						{/* Breadcrumb */}
						<nav>
							<ol className="breadcrumb mb-0">
								{
									breadcrumb.items.map(item => (
										<li key={item.id} className="breadcrumb-item">
											<a href="#">
												{item.title}
											</a>
										</li>
									))
								}
							</ol>
						</nav>

						{/* Search form */}
						<form className="form-row align-items-center">
							<div className="col-auto my-1">
								<div className="input-group">
									<input
										type="text"
										className="form-control border-secondary"
										placeholder="Name"
										value={keyword}
										onChange={this.onChangeKeyword}
									/>
									<button
										className="btn btn-outline-secondary"
										type="submit"
										onClick={this.onClickSearchButton}
									>
										Search
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
};
