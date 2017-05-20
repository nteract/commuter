import React from "react";
import renderer from "react-test-renderer";

import BreadCrumb from "../src";

import { MemoryRouter } from "react-router-dom";

it("renders correctly", () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <BreadCrumb path={"path/for/tests"} basepath={"/view"} />
      </MemoryRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders the correct number of elements", () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <BreadCrumb path={"path/for/tests"} basepath={"/view"} />
      </MemoryRouter>
    )
    .toJSON();
  expect(tree.children.length).toEqual(7);
});
