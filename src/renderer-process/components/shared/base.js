const React = require('react');

module.exports = class Base extends React.Component {
	state = {};

	constructor(props) {
		super(props);
		this.$listens = [];
	}

	componentDidMount() {}

	componentWillUnmount() {
		this.$listens.forEach(x => x());
	}
};
