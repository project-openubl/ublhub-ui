import React from "react";
import { mount, shallow } from "enzyme";
import { DeleteModalWithMatch } from "../delete-modal-with-match";
import { Button } from "@patternfly/react-core";

describe("DeleteModalWithMatch", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <DeleteModalWithMatch
        isModalOpen={true}
        title="Delete modal title"
        message="Are you sure you want to delete this?"
        matchText="delete"
        onDelete={jest.fn}
        onCancel={jest.fn}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Valid cancel", () => {
    const mockOnCancel = jest.fn();
    const wrapper = mount(
      <DeleteModalWithMatch
        isModalOpen={true}
        title="Delete modal title"
        message="Are you sure you want to delete this?"
        matchText="delete"
        onDelete={jest.fn}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = wrapper.find(Button).at(2);
    expect(cancelButton.props().children).toEqual("Cancelar");

    wrapper.find(Button).at(2).simulate("click");
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("Activate 'delete' button and then callback to delete", () => {
    const matchText = "match this text";

    const mockOnDelete = jest.fn();

    const wrapper = mount(
      <DeleteModalWithMatch
        isModalOpen={true}
        title="Delete modal title"
        message="Are you sure you want to delete this?"
        matchText={matchText}
        inProgress={false}
        onDelete={mockOnDelete}
        onCancel={jest.fn()}
      />
    );

    // Verify action buttons
    const deleteButton = wrapper.find(Button).at(1);
    const cancelButton = wrapper.find(Button).at(2);

    expect(deleteButton.props().children).toEqual("Eliminar");
    expect(cancelButton.props().children).toEqual("Cancelar");

    expect(deleteButton.props().isDisabled).toEqual(true);
    expect(cancelButton.props().isDisabled).toEqual(false);

    // Match text
    const nameInput = wrapper.find('input[name="matchText"]');
    (nameInput.getDOMNode() as HTMLInputElement).value = matchText;
    nameInput.simulate("change");
    wrapper.update();

    expect(wrapper.find(Button).at(1).props().isDisabled).toEqual(false);

    // Click delete
    wrapper.find(Button).at(1).simulate("click");
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
