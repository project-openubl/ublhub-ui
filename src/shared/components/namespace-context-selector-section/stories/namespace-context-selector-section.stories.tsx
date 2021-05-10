import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { NamespaceContextSelectorSection } from "../namespace-context-selector-section";

export default {
  title: "Documents / NamespaceContextSelectorSection",
  component: NamespaceContextSelectorSection,
} as Meta;

const Template: Story<{}> = (args) => (
  <NamespaceContextSelectorSection {...args}>
    my content
  </NamespaceContextSelectorSection>
);

export const Basic = Template.bind({});
Basic.args = {};
