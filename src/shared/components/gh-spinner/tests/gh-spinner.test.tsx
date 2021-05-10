import React from "react";
import { shallow } from "enzyme";
import { GhSpinner } from "../gh-spinner";

describe("GhSpinner", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<GhSpinner />);
    expect(wrapper).toMatchSnapshot();
  });
});
