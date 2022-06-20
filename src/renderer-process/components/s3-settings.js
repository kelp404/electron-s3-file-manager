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
		};
	}

	onSubmitUpdateS3SettingsForm(values) {
		console.log({values});
	}

	renderCreateFolderForm = ({errors, submitCount}) => {
		const isSubmitted = submitCount > 0;

		return (
			<Form>
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
			</Form>
		);
	};

	render() {
		const {validateUpdateS3SettingsForm} = this.validators;

		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-12">
						<Formik
							initialValues={this.generateS3SettingsInitialValues()}
							validate={validateUpdateS3SettingsForm}
							onSubmit={this.onSubmitUpdateS3SettingsForm}
						>
							{this.renderCreateFolderForm}
						</Formik>
					</div>
				</div>
			</div>
		);
	}
};
