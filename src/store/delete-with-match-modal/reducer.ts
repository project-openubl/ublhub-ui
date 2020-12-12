import { ActionType, getType } from "typesafe-actions";
import { openModal, closeModal, processing } from "./actions";

export const stateKey = "deleteWithMatchModal";

export type DeleteWithMatchModalState = Readonly<{
  isOpen: boolean;
  isProcessing: boolean;
  title: string;
  message: string;
  matchText: string;
  onDelete: () => void;
}>;

export const defaultState: DeleteWithMatchModalState = {
  isOpen: false,
  isProcessing: false,
  title: "",
  message: "",
  matchText: "",
  onDelete: () => {},
};

export type DeleteWithMatchModalDialogAction = ActionType<
  typeof openModal | typeof closeModal | typeof processing
>;

export const reducer = (
  state: DeleteWithMatchModalState = defaultState,
  action: DeleteWithMatchModalDialogAction
): DeleteWithMatchModalState => {
  switch (action.type) {
    case getType(openModal):
      return {
        ...state,
        ...action.payload,
        isOpen: true,
      };
    case getType(processing):
      return {
        ...state,
        isProcessing: true,
      };
    case getType(closeModal):
      return defaultState;
    default:
      return state;
  }
};
