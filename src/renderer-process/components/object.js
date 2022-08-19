const PropTypes = require('prop-types');
const React = require('react');
const Modal = require('react-bootstrap/Modal').default;
const utils = require('../common/utils');
const Base = require('./shared/base');

module.exports = class ObjectComponent extends Base {
	static propTypes = {
		onClose: PropTypes.func.isRequired,
		object: PropTypes.shape({
			id: PropTypes.number.isRequired,
			basename: PropTypes.string.isRequired,
			size: PropTypes.number.isRequired,
			storageClass: PropTypes.string.isRequired,
			lastModified: PropTypes.instanceOf(Date).isRequired,
			objectHeaders: PropTypes.object.isRequired,
		}).isRequired,
	};

	constructor(props) {
		super(props);
		this.state.isShowModal = true;
	}

	onHideModal = () => {
		this.setState({isShowModal: false});
		setTimeout(this.props.onClose, 300);
	};

	onDeleteObject = event => {
		event.preventDefault();
	};

	onDownloadFile = event => {
		event.preventDefault();
	};

	renderPreview = object => {
		const contentType = object.objectHeaders.ContentType || '';

		if (contentType.startsWith('image/')) {
			return (
				<div className="col-12 mb-2">
					<img
						className="rounded mw-100 mx-auto d-block"
						src={object.url}
						style={{maxHeight: '60vh'}}
					/>
				</div>
			);
		}

		if (contentType.startsWith('video/')) {
			return (
				<div className="col-12 mb-2">
					<video controls className="mw-100 d-block mx-auto" style={{maxHeight: '60vh'}}>
						<source src={object.url} type={contentType}/>
					</video>
				</div>
			);
		}
	};

	render() {
		const {object} = this.props;
		const {isShowModal, isApiProcessing} = this.state;

		return (
			<Modal
				scrollable
				show={isShowModal}
				size="xl"
				onHide={this.onHideModal}
			>
				<Modal.Header closeButton>
					<Modal.Title>{object.basename}</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<div className="row">
						{this.renderPreview(object)}
						<div className="col-12 mb-2">
							<strong className="d-block text-secondary mb-0">Path</strong>
							<span>{object.path}</span>
						</div>
						{
							object.lastModified && (
								<div className="col-12 col-md-6 mb-2">
									<strong className="d-block text-secondary mb-0">Last modified</strong>
									<span>{utils.formatDate(object.lastModified)}</span>
								</div>
							)
						}
						{
							object.size != null && (
								<div className="col-12 col-md-6 mb-2">
									<strong className="d-block text-secondary mb-0">Size</strong>
									<span>{utils.formatSize(object.size)}</span>
								</div>
							)
						}
						{
							object.storageClass && (
								<div className="col-12 col-md-6 mb-2">
									<strong className="d-block text-secondary mb-0">Storage class</strong>
									<span>{object.storageClass}</span>
								</div>
							)
						}
						<div className="col-12">
							<strong className="d-block text-secondary mb-0">Object headers</strong>
							<pre>
								<code>{JSON.stringify(object.objectHeaders, null, 4)}</code>
							</pre>
						</div>
					</div>
				</Modal.Body>

				<Modal.Footer>
					<button
						type="button" className="btn btn-outline-secondary"
						onClick={this.onHideModal}
					>
						Close
					</button>
					<button
						disabled={isApiProcessing}
						type="button" className="btn btn-outline-danger"
						onClick={this.onDeleteObject}
					>
						Delete
					</button>
					<button
						autoFocus
						type="button" className="btn btn-outline-primary"
						onClick={this.onDownloadFile}
					>
						Download
					</button>
				</Modal.Footer>
			</Modal>
		);
	}
};
