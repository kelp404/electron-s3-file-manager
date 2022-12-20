const React = require('react');
const ReactTestRenderer = require('react-test-renderer');
const ErrorIcon = require('../../../../src/renderer-process/components/shared/error-icon');

describe('error-icon', () => {
	test('render', () => {
		const render = ReactTestRenderer.create(<ErrorIcon/>);

		expect(render.toJSON()).toMatchSnapshot();
	});

	test('render with props', () => {
		const render = ReactTestRenderer.create(<ErrorIcon className="m-2"/>);

		expect(render.toJSON()).toMatchSnapshot();
	});
});
