const React = require('react');
const ReactTestRenderer = require('react-test-renderer');
const SuccessIcon = require('../../../../src/renderer-process/components/shared/success-icon');

describe('success-icon', () => {
	test('render', () => {
		const render = ReactTestRenderer.create(<SuccessIcon/>);

		expect(render.toJSON()).toMatchSnapshot();
	});

	test('render with props', () => {
		const render = ReactTestRenderer.create(<SuccessIcon className="m-2"/>);

		expect(render.toJSON()).toMatchSnapshot();
	});
});
