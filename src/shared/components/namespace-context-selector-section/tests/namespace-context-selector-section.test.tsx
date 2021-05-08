import React from "react";
import { shallow } from "enzyme";
import { NamespaceContextSelectorSection } from "../namespace-context-selector-section";

describe("NamespaceContextSelectorSection", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <NamespaceContextSelectorSection>content</NamespaceContextSelectorSection>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
