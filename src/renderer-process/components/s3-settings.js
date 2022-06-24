const classnames = require('classnames');
const React = require('react');
const {Formik, Form, Field} = require('formik');
const {
	updateS3SettingsFormSchema,
} = require('../../shared/validation/form-schemas/settings');
const {
	validateSetupS3SettingsForm,
	validateUpdateS3SettingsForm,
} = require('../validators/settings-validator');
const utils = require('../common/utils');
const {
	STORE_KEYS,
} = require('../common/constants');
const store = require('../common/store');
const Base = require('./shared/base');
const SuccessIcon = require('./shared/success-icon');

const {api} = window;

module.exports = class S3Settings extends Base {
	constructor(props) {
		super(props);
		this.validators = {
			validateSetupS3SettingsForm: utils.makeFormikValidator(validateSetupS3SettingsForm),
			validateUpdateS3SettingsForm: utils.makeFormikValidator(validateUpdateS3SettingsForm),
		};
		this.state.isApiProcessing = false;
		this.state.settings = store.get(STORE_KEYS.SETTINGS);
		this.state.isSubmitSuccess = false;
	}

	generateS3SettingsInitialValues(settings) {
		return {
			accessKeyId: settings?.accessKeyId || '',
			secretAccessKey: '',
			region: settings?.region || '',
			bucket: settings?.bucket || '',
		};
	}

	onSubmitUpdateS3SettingsForm = async (values, {resetForm}) => {
		try {
			utils.addBusyClass();
			this.setState({
				isApiProcessing: true,
				isSubmitSuccess: false,
			});

			const result = await api.send({
				method: 'updateS3Settings',
				data: {...values, secretAccessKey: values.secretAccessKey || undefined},
			});
			const nextSettings = {
				...store.get(STORE_KEYS.SETTINGS),
				...result,
			};

			store.set(STORE_KEYS.SETTINGS, nextSettings);
			this.setState({
				isSubmitSuccess: true,
				settings: nextSettings,
			});
			resetForm({values: this.generateS3SettingsInitialValues(nextSettings)});
		} finally {
			utils.removeBusyClass();
			this.setState({
				isApiProcessing: false,
			});
		}
	};

	renderCreateFolderForm = ({errors, submitCount}) => {
		const {settings, isApiProcessing, isSubmitSuccess} = this.state;
		const isSetupS3Settings = !settings?.accessKeyId;
		const isSubmitted = submitCount > 0;

		return (
			<Form className="card">
				<div className="card-header">
					S3 Settings
				</div>
				<div className="card-body">
					<div className="mb-3">
						<label htmlFor="input-accessKeyId" className="form-label">Access Key ID</label>
						<Field
							autoFocus
							type="text" id="input-accessKeyId" name="accessKeyId"
							className={classnames(
								'form-control',
								{'is-invalid': errors.accessKeyId && isSubmitted},
							)}
							maxLength={updateS3SettingsFormSchema.accessKeyId.max}/>
						{
							(errors.accessKeyId && isSubmitted) && (
								<div className="invalid-feedback">
									{errors.accessKeyId}
								</div>
							)
						}
					</div>
					<div className="mb-3">
						<label htmlFor="input-secretAccessKey" className="form-label">
							{`Secret Access Key${isSetupS3Settings ? '' : ' (Optional)'}`}
						</label>
						<Field
							type="password" id="input-secretAccessKey" name="secretAccessKey"
							className={classnames(
								'form-control',
								{'is-invalid': errors.secretAccessKey && isSubmitted},
							)}
							maxLength={updateS3SettingsFormSchema.secretAccessKey.max}/>
						{
							(errors.secretAccessKey && isSubmitted) && (
								<div className="invalid-feedback">
									{errors.secretAccessKey}
								</div>
							)
						}
						<div className="form-text">
							{'Keep empty when you don\'t want to change it.'}
						</div>
					</div>
					<div className="mb-3">
						<label htmlFor="input-region" className="form-label">Region</label>
						<Field
							type="text" id="input-region" name="region"
							className={classnames(
								'form-control',
								{'is-invalid': errors.region && isSubmitted},
							)}
							maxLength={updateS3SettingsFormSchema.region.max}/>
						{
							(errors.region && isSubmitted) && (
								<div className="invalid-feedback">
									{errors.region}
								</div>
							)
						}
					</div>
					<div className="mb-3">
						<label htmlFor="input-bucket" className="form-label">Bucket</label>
						<Field
							type="text" id="input-bucket" name="bucket"
							className={classnames(
								'form-control',
								{'is-invalid': errors.bucket && isSubmitted},
							)}
							maxLength={updateS3SettingsFormSchema.bucket.max}/>
						{
							(errors.bucket && isSubmitted) && (
								<div className="invalid-feedback">
									{errors.bucket}
								</div>
							)
						}
					</div>
					<div className="d-flex align-items-center">
						<button disabled={isApiProcessing} type="submit" className="btn btn-outline-primary">
							Save
						</button>
						{isSubmitSuccess && <SuccessIcon className="ms-2"/>}
					</div>
				</div>
			</Form>
		);
	};

	render() {
		const {
			validateSetupS3SettingsForm,
			validateUpdateS3SettingsForm,
		} = this.validators;
		const {settings} = this.state;
		const isSetupS3Settings = !settings?.accessKeyId;

		return (
			<div className="row justify-content-center">
				<div className="col-12 col-sm-10 col-md-8 col-lg-6 d-flex flex-column justify-content-center">
					<Formik
						initialValues={this.generateS3SettingsInitialValues(settings)}
						validate={isSetupS3Settings ? validateSetupS3SettingsForm : validateUpdateS3SettingsForm}
						onSubmit={this.onSubmitUpdateS3SettingsForm}
					>
						{this.renderCreateFolderForm}
					</Formik>
				</div>
			</div>
		);
	}
};
