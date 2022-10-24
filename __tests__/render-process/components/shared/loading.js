const React = require('react');
const ReactTestRenderer = require('react-test-renderer');
const Loading = require('../../../../src/renderer-process/components/shared/loading');

describe('loading', () => {
	test('render', () => {
		const render = ReactTestRenderer.create(<Loading/>);

		expect(render.toJSON()).toMatchSnapshot();
	});
});
