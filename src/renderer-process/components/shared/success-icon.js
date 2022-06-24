const classnames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');

module.exports = class SuccessIcon extends React.Component {
	static propTypes = {
		className: PropTypes.any,
	};

	static defaultProps = {
		className: null,
	};

	shouldComponentUpdate() {
		return false;
	}

	render() {
		const {className} = this.props;

		return (
			<div className={classnames('swal2-icon swal2-success swal2-icon-show', className)}>
				<div className="swal2-success-circular-line-left"/>
				<span className="swal2-success-line-tip"/>
				<span className="swal2-success-line-long"/>
				<div className="swal2-success-ring"/>
				<div className="swal2-success-fix"/>
				<div className="swal2-success-circular-line-right"/>
			</div>
		);
	}
};
