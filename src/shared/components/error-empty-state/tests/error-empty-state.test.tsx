import React from "react";
import { shallow } from "enzyme";
import { ErrorEmptyState } from "../error-empty-state";

describe("ErrorEmptyState", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <ErrorEmptyState
        error={{
          code: "404",
          message: "Could not find resource",
          isAxiosError: true,
          name: "My error",
          config: {} as any,
          toJSON: jest.fn(),
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
