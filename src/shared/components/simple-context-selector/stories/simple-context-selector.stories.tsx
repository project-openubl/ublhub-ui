import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import {
  SimpleContextSelector,
  SimpleContextSelectorProps,
} from "../simple-context-selector";

export default {
  title: "Components / SimpleContextSelector",
  component: SimpleContextSelector,
  argTypes: {
    onChange: { action: "onChange" },
  },
} as Meta;

const Template: Story<SimpleContextSelectorProps> = (args) => (
  <SimpleContextSelector {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  value: "value1",
  items: ["value1", "value2", "value3"],
};

export const NoInitialValue = Template.bind({});
NoInitialValue.args = {
  items: ["value1", "value2", "value3"],
};
