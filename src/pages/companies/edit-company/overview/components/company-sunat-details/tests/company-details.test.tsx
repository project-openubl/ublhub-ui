import React from "react";
import { shallow } from "enzyme";
import { CompanySunatDetails } from "../company-sunat-details";

describe("CompanySunatDetails", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <CompanySunatDetails
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
