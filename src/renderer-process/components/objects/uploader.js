const pLimit = require('p-limit');
const pupa = require('pupa').default;
const PropTypes = require('prop-types');
const React = require('react');
const Modal = require('react-bootstrap/Modal').default;
const utils = require('../../common/utils');
const SuccessIcon = require('../shared/success-icon');
const ErrorIcon = require('../shared/error-icon');
const Base = require('../shared/base');

const {api, dialog} = window;

module.exports = class UploaderPage extends Base {
	static propTypes = {
		onClose: PropTypes.func.isRequired,
		dirname: PropTypes.string.isRequired,
	};

	constructor(props) {
		super(props);
		this.state.files = [];
		this.state.isShowModal = true;
		this.state.requestPool = new Set();
	}

	onHideModal = () => {
		this.setState({isShowModal: false});
		setTimeout(this.props.onClose, 300);
	};

	onClickAddFilesButton = async event => {
		event.preventDefault();
		const result = await dialog.showOpenDialog({
			filters: [
				{name: 'All Files', extensions: ['*']},
			],
			properties: ['openFile', 'multiSelections'],
		});

		if (result.canceled) {
			return;
		}

		result.files.forEach(file => {
			file.id = Math.random().toString(36);
		});
		this.setState(prevState => ({
			files: [...prevState.files, ...result.files],
		}));
	};

	onClickDeleteFileButton = event => {
		const {fileId} = event.target.dataset;

		this.setState(prevState => {
			const index = prevState.files.findIndex(file => file.id === fileId);

			if (index < 0) {
				return null;
			}

			return {
				files: [
					...prevState.files.slice(0, index),
					...prevState.files.slice(index + 1),
				],
			};
		});
	};

	onClickUploadFilesButton = async () => {
		try {
			const {dirname} = this.props;
			const uploadLimit = pLimit(1);
			const updateStateLimit = pLimit(1);
			let hasError;
			const updateFileState = (fileId, fields) => new Promise(resolve => {
				this.setState(
					prevState => {
						const index = prevState.files.findIndex(({id}) => fileId === id);

						if (index < 0) {
							return null;
						}

						return {
							files: [
								...prevState.files.slice(0, index),
								{...prevState.files[index], ...fields},
								...prevState.files.slice(index + 1),
							],
						};
					},
					resolve,
				);
			});

			utils.addBusyClass();
			await Promise.all(this.files.map(file => uploadLimit(async () => {
				let isUploadSuccess;

				try {
					await api.file.uploadFile({
						file,
						dirname,
						async onUploadProgress(progressEvent) {
							await updateStateLimit(() =>
								updateFileState(file.id, {
									progress: parseInt((progressEvent.loaded / progressEvent.total) * 90, 10),
								}),
							);
						},
					});
					isUploadSuccess = true;
				} catch (_) {
					isUploadSuccess = false;
					hasError = true;
				}

				await updateStateLimit(() =>
					updateFileState(file.id, {
						progress: null,
						isSuccess: isUploadSuccess,
						isFailed: !isUploadSuccess,
					}),
				);
			})));

			if (hasError) {
				utils.removeBusyClass();
			} else {
				// Todo: go back and reload
			}
		} catch (error) {
			utils.removeBusyClass();
			dialog.showErrorBox('Error', `${error.message}`);
		}
	};

	emptyFileRowComponent = (
		<li className="list-group-item text-muted text-center py-4">Please add files to upload.</li>
	);

	render() {
		const {dirname} = this.props;
		const {requestPool, isShowModal, files} = this.state;
		const isApiProcessing = requestPool.size > 0;

		return (
			<Modal
				scrollable
				show={isShowModal}
				backdrop="static"
				size="xl"
				onHide={this.onHideModal}
			>
				<Modal.Header closeButton>
					<Modal.Title>Upload files</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<h5>{pupa('Upload files to /{0}.', [dirname || ''])}</h5>
					<div className="card shadow-sm">
						<div className="card-header d-flex justify-content-between">
							<div>Files</div>
							<button
								type="button"
								className="btn btn-sm btn-outline-success"
								style={{lineHeight: 'initial'}}
								onClick={this.onClickAddFilesButton}
							>
								Add
							</button>
						</div>
						<ul className="list-group list-group-flush">
							{files.length === 0 && this.emptyFileRowComponent}
							{
								files.map(file => (
									<li key={file.id} className="list-group-item d-flex justify-content-between">
										<div className="d-flex align-items-center flex-grow-1 pe-2">
											<div>{file.name}</div>
											<div className="ms-2">
												<small className="text-muted">{utils.formatSize(file.size)}</small>
											</div>
											{
												file.progress != null && (
													<div className="progress ms-2" style={{height: '10px', width: '100px'}}>
														<div
															className="progress-bar progress-bar-striped progress-bar-animated"
															style={{width: `${file.progress}%`}}/>
													</div>
												)
											}
											{file.isSuccess && <div><SuccessIcon className="ms-2"/></div>}
											{file.isFailed && <div><ErrorIcon className="ms-2"/></div>}
										</div>
										<button
											disabled={isApiProcessing}
											data-file-id={file.id}
											type="button"
											className="btn btn-sm btn-outline-danger"
											style={{lineHeight: 'initial'}}
											onClick={this.onClickDeleteFileButton}
										>
											Delete
										</button>
									</li>
								))
							}
						</ul>
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
						disabled={isApiProcessing || !files.length}
						type="button" className="btn btn-outline-primary"
						onClick={this.onClickUploadFilesButton}
					>
						Submit
					</button>
				</Modal.Footer>
			</Modal>
		);
	}
};
