import React from "react";
import { HashRouter } from "react-router-dom";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  CompanySunatDetails,
  CompanySunatDetailsProps,
} from "../company-sunat-details";

export default {
  title: "Edit company / CompanySunatDetails",
  component: CompanySunatDetails,
  argTypes: {},
} as Meta;

const Template: Story<CompanySunatDetailsProps> = (args) => (
  <HashRouter>
    <CompanySunatDetails {...args} />
  </HashRouter>
);
export const Basic = Template.bind({});
Basic.args = {
  company: {
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
