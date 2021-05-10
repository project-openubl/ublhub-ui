import React from "react";
import { mount, shallow } from "enzyme";
import { SimpleContextSelector } from "../simple-context-selector";
import { Namespace } from "api/models";

describe("SimpleContextSelector", () => {
  const namespaces: Namespace[] = [
    { name: "ns1" },
    { name: "ns2" },
    { name: "ns3" },
  ];

  it("Renders without crashing", () => {
    const wrapper = shallow(
      <SimpleContextSelector
        value={namespaces[0]}
        items={namespaces}
        onChange={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Select item", () => {
    const onChangeSpy = jest.fn();

    const wrapper = mount(
      <SimpleContextSelector items={namespaces} onChange={onChangeSpy} />
    );

    wrapper.find(".pf-c-context-selector__toggle").simulate("click");
    wrapper
      .find(".pf-c-context-selector__menu-list-item")
      .at(1)
      .simulate("click");

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toBeCalledWith(namespaces[1]);
  });

  it("Filter items", () => {
    const onChangeSpy = jest.fn();

    const wrapper = mount(
      <SimpleContextSelector items={namespaces} onChange={onChangeSpy} />
    );

    wrapper.find(".pf-c-context-selector__toggle").simulate("click");

    const searchInput = wrapper.find("input");
    (searchInput.getDOMNode() as HTMLInputElement).value = "1";
    searchInput.simulate("change");
    wrapper.update();

    expect(wrapper.find(".pf-c-context-selector__menu-list-item").length).toBe(
      1
    );
    expect(wrapper.find(".pf-c-context-selector__menu-list-item").text()).toBe(
      "ns1"
    );
  });
});
