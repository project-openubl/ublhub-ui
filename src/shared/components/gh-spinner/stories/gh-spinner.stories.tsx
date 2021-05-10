import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { GhSpinner, GhSpinnerProps } from "../gh-spinner";

export default {
  title: "Components / GhSpinner",
  component: GhSpinner,
} as Meta;

const Template: Story<GhSpinnerProps> = (args) => <GhSpinner {...args} />;

export const Md = Template.bind({});
Md.args = {
  size: "md",
};
