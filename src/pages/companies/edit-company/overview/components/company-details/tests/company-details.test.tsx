import React from "react";
import { shallow } from "enzyme";
import { CompanyDetails } from "../company-details";

describe("CompanyDetails", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <CompanyDetails
        company={{
          name: "my company",
          description: "my description",
          webServices: {
            factura: "http://url1.com",
            guia: "http://url2.com",
            retenciones: "http://url3.com",
          },
          credentials: {
            username: "myUsername",
            password: "myPassword",
          },
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
