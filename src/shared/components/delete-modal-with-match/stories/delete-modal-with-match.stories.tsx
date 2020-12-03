import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  DeleteModalWithMatch,
  DeleteModalWithMatchProps,
} from "../delete-modal-with-match";

export default {
  title: "Components / DeleteModalWithMatch",
  component: DeleteModalWithMatch,
  argTypes: {
    onDelete: { action: "delete" },
    onCancel: { action: "cancel" },
  },
} as Meta;

const Template: Story<DeleteModalWithMatchProps> = (args) => (
  <DeleteModalWithMatch {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  isModalOpen: true,
  title: "Delete project",
  message: "Are you sure you want to delete the project 'ABC'",
  matchText: "ABC",
  inProgress: false,
};

export const InProgress = Template.bind({});
InProgress.args = {
  ...Basic.args,
  inProgress: true,
};
