import React from "react";
import { mount, shallow } from "enzyme";
import { SimpleContextSelector } from "../simple-context-selector";

describe("SimpleContextSelector", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <SimpleContextSelector
        value="value1"
        items={["value1", "value2", "value3"]}
        onChange={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Select item", () => {
    const onChangeSpy = jest.fn();

    const wrapper = mount(
      <SimpleContextSelector
        items={["value1", "value2", "value3"]}
        onChange={onChangeSpy}
      />
    );

    wrapper.find(".pf-c-context-selector__toggle").simulate("click");
    wrapper
      .find(".pf-c-context-selector__menu-list-item")
      .at(1)
      .simulate("click");

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toBeCalledWith("value2");
  });

  it("Filter items", () => {
    const onChangeSpy = jest.fn();

    const wrapper = mount(
      <SimpleContextSelector
        items={["value1", "value2", "value3", "myValue"]}
        onChange={onChangeSpy}
      />
    );

    wrapper.find(".pf-c-context-selector__toggle").simulate("click");

    const searchInput = wrapper.find("input");
    (searchInput.getDOMNode() as HTMLInputElement).value = "my";
    searchInput.simulate("change");
    wrapper.update();

    expect(wrapper.find(".pf-c-context-selector__menu-list-item").length).toBe(
      1
    );
    expect(wrapper.find(".pf-c-context-selector__menu-list-item").text()).toBe(
      "myValue"
    );
  });
});
