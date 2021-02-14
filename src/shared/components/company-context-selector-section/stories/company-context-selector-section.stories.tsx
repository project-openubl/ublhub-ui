import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { CompanyContextSelectorSection } from "../company-context-selector-section";

export default {
  title: "Documents / CompanyContextSelectorSection",
  component: CompanyContextSelectorSection,
} as Meta;

const Template: Story<{}> = (args) => (
  <CompanyContextSelectorSection {...args}>
    my content
  </CompanyContextSelectorSection>
);

export const Basic = Template.bind({});
Basic.args = {};
