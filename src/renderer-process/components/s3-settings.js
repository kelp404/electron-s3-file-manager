const classnames = require('classnames');
const React = require('react');
const {Formik, Form, Field} = require('formik');
const {
	updateS3SettingsFormSchema,
} = require('../../shared/validation/form-schemas/settings');
const {
	validateUpdateS3SettingsForm,
} = require('../validators/settings-validator');
const utils = require('../common/utils');

module.exports = class S3Settings extends React.Component {
	constructor(props) {
		super(props);
		this.validators = {
			validateUpdateS3SettingsForm: utils.makeFormikValidator(validateUpdateS3SettingsForm),
		};
	}

	generateS3SettingsInitialValues() {
		return {
			accessKeyId: '',
			secretAccessKey: '',
			region: '',
			bucket: '',
		};
	}

	onSubmitUpdateS3SettingsForm(values) {
		console.log({values});
	}

	renderCreateFolderForm = ({errors, submitCount}) => {
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
						<label htmlFor="input-secretAccessKey" className="form-label">Secret Access Key</label>
						<Field
							type="text" id="input-secretAccessKey" name="secretAccessKey"
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
					<button type="submit" className="btn btn-outline-primary">
						Save
					</button>
				</div>
			</Form>
		);
	};

	render() {
		const {validateUpdateS3SettingsForm} = this.validators;

		return (
			<div className="row justify-content-center">
				<div
					className="col-12 col-sm-10 col-md-8 col-lg-6 d-flex flex-column justify-content-center"
					style={{minHeight: 'calc(100vh - 60px)'}}
				>
					<Formik
						initialValues={this.generateS3SettingsInitialValues()}
						validate={validateUpdateS3SettingsForm}
						onSubmit={this.onSubmitUpdateS3SettingsForm}
					>
						{this.renderCreateFolderForm}
					</Formik>
				</div>
			</div>
		);
	}
};
