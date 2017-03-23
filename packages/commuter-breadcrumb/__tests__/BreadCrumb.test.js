import React from 'react';
import renderer from 'react-test-renderer';

import BreadCrumb from '../src';

it('renders correctly', () => {
  const tree = renderer.create(
    <BreadCrumb
      path={"path/for/tests"}
      onClick={() => {}}
      basepath={"/view"}
    />
  ).toJSON();
  expect(tree).toMatchSnapshot(); 
});

it('renders the correct number of elements', () => {
  const tree = renderer.create(
    <BreadCrumb
      path={"path/for/tests"}
      onClick={() => {}}
      basepath={"/view"}
    />
  ).toJSON();
  expect(tree.children.length).toEqual(7);
});
