import React from "react";
import { shallow } from "enzyme";
import { ButtonAboutApp } from "../ButtonAboutApp";

it("Test snapshot", () => {
  const wrapper = shallow(<ButtonAboutApp />);
  expect(wrapper).toMatchSnapshot();
});
