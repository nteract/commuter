// Link.react.test.js
import React from 'react';
import {shallow} from 'enzyme';
import Clone from '../components/headers/clone.js';
import renderer from 'react-test-renderer';

test('render component', () => {
  const component = renderer.create(
    <Clone />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('debounce onclick', () => {
    let wrapper = shallow(<Clone/>);
    const cloneMock = jest.fn();
    wrapper.instance().clone = cloneMock;
    expect(wrapper.find('span').hasClass('disabled')).toEqual(false);
    wrapper.instance().onClick();
    wrapper.instance().onClick();
    wrapper.instance().onClick();
    wrapper.instance().onClick();
    wrapper.instance().onClick();
    expect(wrapper.find('span').hasClass('disabled')).toEqual(true);
    expect(cloneMock).toHaveBeenCalledTimes(1);
});
