import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { ErrorEmptyState, ErrorEmptyStateProps } from "../error-empty-state";

export default {
  title: "Components / ErrorEmptyState",
  component: ErrorEmptyState,
  argTypes: {
    onPrimaryAction: { action: "clicked" },
  },
} as Meta;

const Template: Story<ErrorEmptyStateProps> = (args) => (
  <ErrorEmptyState {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  error: {
    code: "404",
    message: "Could not find resource",
    isAxiosError: true,
    name: "My error",
    config: {} as any,
    toJSON: () => ({}),
  },
};
