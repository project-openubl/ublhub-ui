import { useCallback, useReducer } from "react";
import { ActionType, createAction, getType } from "typesafe-actions";

const startCreate = createAction("useModal/action/startCreate")();
const startUpdate = createAction("useModal/action/startUpdate")<any>();
const startClose = createAction("useModal/action/startClose")();

// State
type State = Readonly<{
  entity: any;
  isOpen: boolean;
}>;

const defaultState: State = {
  entity: undefined,
  isOpen: false,
};

// Reducer

type Action = ActionType<
  typeof startCreate | typeof startUpdate | typeof startClose
>;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case getType(startCreate):
      return {
        ...state,
        entity: undefined,
        isOpen: true,
      };
    case getType(startUpdate):
      return {
        ...state,
        entity: action.payload,
        isOpen: true,
      };
    case getType(startClose):
      return {
        ...state,
        entity: undefined,
        isOpen: false,
      };
    default:
      return state;
  }
};

// Hook

interface HookState<T> {
  value?: T;
  isOpen: boolean;
  create: () => void;
  update: (value: T) => void;
  close: () => void;
}

export const useModal = <T>(): HookState<T> => {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
  });

  const createHandler = useCallback(() => {
    dispatch(startCreate());
  }, []);

  const updateHandler = useCallback((entity: T) => {
    dispatch(startUpdate(entity));
  }, []);

  const closeHandler = useCallback(() => {
    dispatch(startClose());
  }, []);

  return {
    value: state.entity,
    isOpen: state.isOpen,
    create: createHandler,
    update: updateHandler,
    close: closeHandler,
  };
};

export default useModal;
