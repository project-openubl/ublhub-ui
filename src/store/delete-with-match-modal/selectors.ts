import { RootState } from "../rootReducer";
import { stateKey } from "./reducer";

export const deleteWithMatchModalState = (state: RootState) => state[stateKey];

export const isProcessing = (state: RootState) =>
  deleteWithMatchModalState(state).isProcessing;

export const isOpen = (state: RootState) =>
  deleteWithMatchModalState(state).isOpen;

export const title = (state: RootState) =>
  deleteWithMatchModalState(state).title;

export const message = (state: RootState) =>
  deleteWithMatchModalState(state).message;

export const matchText = (state: RootState) =>
  deleteWithMatchModalState(state).matchText;

export const onDelete = (state: RootState) =>
  deleteWithMatchModalState(state).onDelete;
