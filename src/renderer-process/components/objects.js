const PropTypes = require('prop-types');
const React = require('react');
const OBJECT_TYPE = require('../../shared/constants/object-type');
const STORAGE_CLASS = require('../../shared/constants/storage-class');
const utils = require('../common/utils');
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

	render() {
		return (
			<div className="row">
				<div className="col-12">
					<div className="d-flex align-items-center justify-content-between mb-3">
						{/* Breadcrumb */}
					</div>
				</div>
			</div>
		);
	}
};
