import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { DocumentStatus, DocumentStatusProps } from "../document-status";

export default {
  title: "Components / DocumentStatus",
  component: DocumentStatus,
} as Meta;

const Template: Story<DocumentStatusProps> = (args) => (
  <DocumentStatus {...args} />
);

export const Scheduled = Template.bind({});
Scheduled.args = {
  status: "Scheduled",
};

export const InProgress = Template.bind({});
InProgress.args = {
  status: "InProgress",
};

export const Success = Template.bind({});
Success.args = {
  status: "Success",
};

export const Error = Template.bind({});
Error.args = {
  status: "Error",
};
