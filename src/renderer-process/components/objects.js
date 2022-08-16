const PropTypes = require('prop-types');
const React = require('react');
const InfiniteScroll = require('@kelp404/react-infinite-scroller');
const OBJECT_TYPE = require('../../shared/constants/object-type');
const STORAGE_CLASS = require('../../shared/constants/storage-class');
const utils = require('../common/utils');
const store = require('../common/store');
const {STORE_KEYS} = require('../common/constants');
const Base = require('./shared/base');
const Loading = require('./shared/loading');

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

		this.state.requestPool = new Set();
		this.state.dirname = '';
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
		this.state.checked = Object.fromEntries(props.objects.items.map(({id}) => [id, false]));
		this.state.objectTable = {...props.objects, items: [null, ...props.objects.items]};
	}

	hasAnyChecked = () => {
		const {checked} = this.state;

		for (const key in checked) {
			if (checked[key]) {
				return true;
			}
		}

		return false;
	};

	onChangeCheckAll = event => {
		const {objectTable} = this.state;

		this.setState({
			checked: Object.fromEntries(
				objectTable.items.slice(1).map(object => [object.id, Boolean(event.target.checked)]),
			),
		});
	};

	onChangeCheckObject = event => {
		const {objectId} = event.target.dataset;

		this.setState(prevState => ({
			checked: {
				...prevState.checked,
				[objectId]: !prevState.checked[objectId],
			},
		}));
	};

	onClickSearchButton = event => {
		event.preventDefault();
		// Todo: search objects
	};

	onChangeKeyword = event => {
		this.setState({keyword: event.target.value});
	};

	onClickDeleteObjectsButton = event => {
		event.preventDefault();
	};

	onClickDownloadObjectsButton = event => {
		event.preventDefault();
	};

	onClickNewFolderButton = event => {
		event.preventDefault();
	};

	onClickUploadButton = event => {
		event.preventDefault();
	};

	onLoadNextPage = async () => {
	};

	objectsHeaderComponent = (
		<li key={0} className="list-group-item d-flex align-items-end">
			<div className="pe-1">
				<div className="form-check">
					<input className="form-check-input" type="checkbox" onChange={this.onChangeCheckAll}/>
				</div>
			</div>
			<div className="flex-grow-1 px-1 text-truncate">
				<strong>Name</strong>
			</div>
			<div className="d-none d-lg-block text-truncate" style={{minWidth: '200px'}}>
				<strong>Storage class</strong>
			</div>
			<div className="px-1 text-truncate" style={{minWidth: '270px'}}>
				<strong>Last modified</strong>
			</div>
			<div className="ps-1" style={{minWidth: '86px'}}>
				<strong>Size</strong>
			</div>
		</li>
	);

	emptyObjectRowComponent = (
		<li className="list-group-item py-4 text-muted text-center">Empty</li>
	);

	infiniteScrollLoadingComponent = (
		<li key="loading" className="list-group"><Loading/></li>
	);

	renderObjectRow = object => {
		const {checked, dirname} = this.state;
		let name = dirname
			? object.path.replace(`${dirname}/`, '')
			: object.path;

		if (object.type === OBJECT_TYPE.FOLDER) {
			// Remove "/" at suffix.
			name = name.slice(0, -1);
		}

		return (
			<li key={object.id} className="object-row list-group-item d-flex align-items-end">
				<div className="pe-1">
					<div className="form-check">
						<input
							data-object-id={object.id}
							className="form-check-input"
							type="checkbox"
							checked={checked[object.id]}
							onChange={this.onChangeCheckObject}
						/>
					</div>
				</div>
				<div className="px-1 text-muted">
					{
						object.type === OBJECT_TYPE.FILE
							? <i className="fa-fw fa-regular fa-file-lines"/>
							: <i className="fa-fw fa-regular fa-folder"/>
					}
				</div>
				<div className="flex-grow-1 px-1 text-truncate">
					<a href="#">{name}</a>
				</div>
				<div className="d-none d-lg-block text-truncate" style={{minWidth: '200px'}}>
					{object.storageClass || '-'}
				</div>
				<pre className="px-1 m-0 text-truncate" style={{minWidth: '270px'}}>
					{object.lastModified ? utils.formatDate(object.lastModified) : '-'}
				</pre>
				<pre className="ps-1 m-0 text-end" style={{minWidth: '86px'}}>
					{object.size == null ? '-' : utils.formatSize(object.size)}
				</pre>
			</li>
		);
	};

	render() {
		const {breadcrumb, keyword, requestPool, objectTable} = this.state;
		const isApiProcessing = requestPool.size > 0;
		const hasAnyChecked = this.hasAnyChecked();

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

					<div className="card shadow-sm">
						<div className="card-header d-flex justify-content-between">
							<div>
								<button
									type="button"
									className="btn btn-sm btn-outline-danger"
									style={{lineHeight: 'initial'}}
									disabled={isApiProcessing || !hasAnyChecked}
									onClick={this.onClickDeleteObjectsButton}
								>
									Delete
								</button>
								<button
									type="button"
									className="btn btn-sm btn-outline-primary ms-2"
									style={{lineHeight: 'initial'}}
									disabled={isApiProcessing || !hasAnyChecked}
									onClick={this.onClickDownloadObjectsButton}
								>
									Download
								</button>
							</div>
							<div>
								<button
									type="button"
									className="btn btn-sm btn-outline-secondary"
									style={{lineHeight: 'initial'}}
									disabled={isApiProcessing}
									onClick={this.onClickNewFolderButton}
								>
									New folder
								</button>
								<button
									type="button"
									className="btn btn-sm btn-outline-success ms-2"
									style={{lineHeight: 'initial'}}
									disabled={isApiProcessing}
									onClick={this.onClickUploadButton}
								>
									Upload
								</button>
							</div>
						</div>

						{
							objectTable.items.length === 1 && (
								<ul className="objects-wrapper list-group list-group-flush">
									{this.objectsHeaderComponent}
									{this.emptyObjectRowComponent}
								</ul>
							)
						}
						{
							objectTable.items.length > 1 && (
								<InfiniteScroll
									element="ul"
									className="objects-wrapper list-group list-group-flush"
									pageStart={0}
									loadMore={this.onLoadNextPage}
									hasMore={objectTable.hasNextPage}
									loader={this.infiniteScrollLoadingComponent}
								>
									{this.objectsHeaderComponent}
									{objectTable.items.slice(1).map(object => this.renderObjectRow(object))}
								</InfiniteScroll>
							)
						}
					</div>
				</div>
			</div>
		);
	}
};
