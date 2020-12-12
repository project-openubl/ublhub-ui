import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { DeleteModalWithMatch } from "shared/components";

import { RootState } from "store/rootReducer";
import {
  deleteWithMatchModalSelectors,
  deleteWithMatchModalActions,
} from "store/delete-with-match-modal";

export const DeleteWithMatchModalContainer: React.FC = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state: RootState) =>
    deleteWithMatchModalSelectors.isOpen(state)
  );
  const isProcessing = useSelector((state: RootState) =>
    deleteWithMatchModalSelectors.isProcessing(state)
  );

  const title = useSelector((state: RootState) =>
    deleteWithMatchModalSelectors.title(state)
  );
  const message = useSelector((state: RootState) =>
    deleteWithMatchModalSelectors.message(state)
  );
  const matchText = useSelector((state: RootState) =>
    deleteWithMatchModalSelectors.matchText(state)
  );

  const onDelete = useSelector((state: RootState) =>
    deleteWithMatchModalSelectors.onDelete(state)
  );

  const onCancel = () => {
    dispatch(deleteWithMatchModalActions.closeModal());
  };

  return (
    <DeleteModalWithMatch
      isModalOpen={isOpen}
      title={title}
      message={message}
      matchText={matchText}
      inProgress={isProcessing}
      onCancel={onCancel}
      onDelete={onDelete}
    />
  );
};
