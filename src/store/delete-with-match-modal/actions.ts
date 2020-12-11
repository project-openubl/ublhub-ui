import { createAction } from "typesafe-actions";

interface Item {
  title: string;
  message: string;
  matchText: string;
  onDelete: () => void;
}

export const openModal = createAction("dialogWithMatch/delete/open")<Item>();
export const closeModal = createAction("dialogWithMatch/delete/close")<void>();
export const processing = createAction("dialogWithMatch/delete/processing")<
  void
>();
