import { Namespace } from "api/models";
import { AxiosError } from "axios";
import { ActionType, getType } from "typesafe-actions";

import {
  fetchNamespacesRequest,
  fetchNamespacesSuccess,
  fetchNamespacesFailure,
  setNamespaceContext,
} from "./actions";

export const stateKey = "namespaceContext";

export type NamespaceContextState = Readonly<{
  current?: Namespace;
  namespaces: Namespace[];
  namespacesIsFetching: boolean;
  namespacesFetchError?: AxiosError;
}>;

export const defaultState: NamespaceContextState = {
  current: undefined,
  namespaces: [],
  namespacesIsFetching: false,
  namespacesFetchError: undefined,
};

export type NamespaceContextAction = ActionType<
  | typeof fetchNamespacesRequest
  | typeof fetchNamespacesSuccess
  | typeof fetchNamespacesFailure
  | typeof setNamespaceContext
>;

export function namespaceContextReducer(
  state = defaultState,
  action: NamespaceContextAction
): NamespaceContextState {
  switch (action.type) {
    case getType(fetchNamespacesRequest):
      return {
        ...state,
        namespacesIsFetching: true,
      };
    case getType(fetchNamespacesSuccess):
      return {
        ...state,
        namespaces: action.payload,
        namespacesFetchError: undefined,
        namespacesIsFetching: false,
      };
    case getType(fetchNamespacesFailure):
      return {
        ...state,
        namespacesFetchError: action.payload,
        namespacesIsFetching: false,
      };

    case getType(setNamespaceContext):
      return {
        ...state,
        current: action.payload,
      };

    default:
      return state;
  }
}
