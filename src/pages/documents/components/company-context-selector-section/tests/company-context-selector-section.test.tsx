import React from "react";
import { shallow } from "enzyme";
import { CompanyContextSelectorSection } from "../company-context-selector-section";

describe("CompanyContextSelectorSection", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <CompanyContextSelectorSection>content</CompanyContextSelectorSection>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
