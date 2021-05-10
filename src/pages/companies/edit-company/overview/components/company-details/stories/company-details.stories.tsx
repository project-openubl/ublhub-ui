import React from "react";
import { HashRouter } from "react-router-dom";
import { Story, Meta } from "@storybook/react/types-6-0";
import { CompanyDetails, CompanyDetailsProps } from "../company-details";

export default {
  title: "Edit company / CompanyDetails",
  component: CompanyDetails,
  argTypes: {},
} as Meta;

const Template: Story<CompanyDetailsProps> = (args) => (
  <HashRouter>
    <CompanyDetails {...args} />
  </HashRouter>
);
export const Basic = Template.bind({});
Basic.args = {
  company: {
    ruc: "12345678910",
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
  },
};
