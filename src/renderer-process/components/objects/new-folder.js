const classnames = require('classnames');
const pupa = require('pupa').default;
const PropTypes = require('prop-types');
const {Formik, Form, Field} = require('formik');
const React = require('react');
const Modal = require('react-bootstrap/Modal').default;
const {
	SHOW_OBJECT_DUPLICATED_ALERT,
} = require('../../../shared/constants/frontend-operation-code');
const {
	createFolderFormSchema,
} = require('../../../shared/validation/form-schemas/object');
const {
	validateCreateFolderForm,
} = require('../../validators/object-validator');
const utils = require('../../common/utils');
const Base = require('../shared/base');

const {api, dialog} = window;

module.exports = class NewFolderModal extends Base {
	static propTypes = {
		onClose: PropTypes.func.isRequired,
		dirname: PropTypes.string.isRequired,
	};

	constructor(props) {
		super(props);
		this.validators = {
			validateCreateFolderForm: utils.makeFormikValidator(validateCreateFolderForm),
		};
		this.state.requestPool = new Set();
		this.state.isShowModal = true;
		this.state.pathDuplicatedAlertMessage = null;
	}

	generateCreateFolderInitialValues = () => ({
		dirname: this.props.dirname,
		basename: '',
	});

	onHideModal = () => {
		this.setState({isShowModal: false});
		setTimeout(this.props.onClose, 300);
	};

	onSubmitCreateFolderForm = async ({dirname, basename}) => {
		const requestId = Math.random().toString(36);

		try {
			utils.addBusyClass();
			this.setState(prevState => ({
				pathDuplicatedAlertMessage: null,
				requestPool: new Set([...prevState.requestPool, requestId]),
			}));

			await api.createFolder({dirname, basename});
			this.setState({isShowModal: false});
			setTimeout(() => this.props.onClose({reload: true}), 300);
		} catch (error) {
			utils.removeBusyClass();
			if (error?.extra?.frontendOperationCode === SHOW_OBJECT_DUPLICATED_ALERT) {
				this.setState({
					pathDuplicatedAlertMessage: pupa(
						'The path "{0}" is already exists.',
						[error?.extra?.frontendOperationValue],
					),
				});

				return;
			}

			dialog.showErrorBox('Error', `${error.message}`);
		} finally {
			this.setState(prevState => {
				prevState.requestPool.delete(requestId);
				return {requestPool: new Set(prevState.requestPool)};
			});
		}
	};

	renderCreateFolderForm = ({errors, submitCount, initialValues}) => {
		const {pathDuplicatedAlertMessage, requestPool} = this.state;
		const isApiProcessing = requestPool.size > 0;
		const isSubmitted = submitCount > 0;

		return (
			<Form>
				<Modal.Header closeButton>
					<Modal.Title>New folder</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<div className="mb-3">
						<label htmlFor="input-basename" className="col-form-label">Path</label>
						<div
							className={classnames(
								'input-group mb-3',
								{'has-validation': (errors.basename && isSubmitted) || pathDuplicatedAlertMessage},
							)}
						>
							{initialValues.dirname && <span className="input-group-text">{initialValues.dirname}/</span>}
							<Field
								autoFocus
								type="text" id="input-basename" name="basename"
								placeholder="Folder name"
								className={classnames(
									'form-control',
									{'is-invalid': (errors.basename && isSubmitted) || pathDuplicatedAlertMessage},
								)}
								maxLength={createFolderFormSchema.basename.max}/>
							{
								((errors.basename && isSubmitted) || pathDuplicatedAlertMessage) && (
									<div className="invalid-feedback">
										{errors.basename && isSubmitted && <div>{errors.basename}</div>}
										{pathDuplicatedAlertMessage && <div>{pathDuplicatedAlertMessage}</div>}
									</div>
								)
							}
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
						type="submit" className="btn btn-outline-primary"
					>
						Submit
					</button>
				</Modal.Footer>
			</Form>
		);
	};

	render() {
		const {validateCreateFolderForm} = this.validators;
		const {isShowModal} = this.state;

		return (
			<Modal
				scrollable
				size="lg"
				show={isShowModal}
				onHide={this.onHideModal}
			>
				<Formik
					initialValues={this.generateCreateFolderInitialValues()}
					validate={validateCreateFolderForm}
					onSubmit={this.onSubmitCreateFolderForm}
				>
					{this.renderCreateFolderForm}
				</Formik>
			</Modal>
		);
	}
};
