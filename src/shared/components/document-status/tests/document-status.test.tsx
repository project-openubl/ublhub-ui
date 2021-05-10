import React from "react";
import { shallow } from "enzyme";
import { DocumentStatus } from "../document-status";

describe("DocumentStatus", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<DocumentStatus status="InProgress" />);
    expect(wrapper).toMatchSnapshot();
  });
});
