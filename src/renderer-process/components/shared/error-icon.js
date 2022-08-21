const classnames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');

module.exports = class ErrorIcon extends React.Component {
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
			<div
				className={classnames(
					'swal2-icon swal2-error swal2-icon-show d-flex',
					className,
				)}
			>
				<span className="swal2-x-mark">
					<span className="swal2-x-mark-line-left"/>
					<span className="swal2-x-mark-line-right"/>
				</span>
			</div>
		);
	}
};
