import React from "react";
import { mount } from "enzyme";

import { FormRenderer } from "@data-driven-forms/react-form-renderer";
import {
  ComponentMapper,
  FormTemplate,
} from "@data-driven-forms/pf4-component-mapper";

import newCompanySchema from "../schemaForm";
import { NewCompanyFormValues } from "../new-company";

describe("<FormRendererTest />", () => {
  /**
   * Create submit spy
   */
  const submitSpy = jest.fn();

  it("should validate and submit the form", async () => {
    /**
     * we will be using mount because we will need the DOM updates
     */
    const wrapper = mount(
      <FormRenderer
        onSubmit={submitSpy}
        componentMapper={ComponentMapper}
        FormTemplate={FormTemplate}
        schema={newCompanySchema}
      />
    );

    /**
     * we can try submit the form when the validation is not met
     */
    wrapper.find("form").simulate("submit");
    expect(submitSpy).not.toHaveBeenCalled();

    /**
     * fill the user name to pass the validation
     */
    const nameInput = wrapper.find('input[name="name"]');
    (nameInput.getDOMNode() as HTMLInputElement).value = "myCompany";
    nameInput.simulate("change");

    const url1Input = wrapper.find('input[name="webServices.factura"]');
    (url1Input.getDOMNode() as HTMLInputElement).value = "http://url1.com";
    url1Input.simulate("change");

    const url2Input = wrapper.find('input[name="webServices.guia"]');
    (url2Input.getDOMNode() as HTMLInputElement).value = "http://url2.com";
    url2Input.simulate("change");

    const url3Input = wrapper.find('input[name="webServices.retenciones"]');
    (url3Input.getDOMNode() as HTMLInputElement).value = "http://url3.com";
    url3Input.simulate("change");

    const usernameInput = wrapper.find('input[name="credentials.username"]');
    (usernameInput.getDOMNode() as HTMLInputElement).value = "myUsername";
    usernameInput.simulate("change");

    const passwordInput = wrapper.find('input[name="credentials.password"]');
    (passwordInput.getDOMNode() as HTMLInputElement).value = "myPassword";
    passwordInput.simulate("change");

    wrapper.find("form").simulate("submit");

    /**
     * first argument are the values and the second one is formApi
     */
    const formValues: NewCompanyFormValues = {
      name: "myCompany",
      webServices: {
        factura: "http://url1.com",
        guia: "http://url2.com",
        retenciones: "http://url3.com",
      },
      credentials: {
        username: "myUsername",
        password: "myPassword",
      },
    };
    expect(submitSpy).toHaveBeenLastCalledWith(
      formValues,
      expect.any(Object),
      expect.any(Function)
    );
    submitSpy.mockReset();
  });
});
