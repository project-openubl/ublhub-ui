import { RootState } from "../rootReducer";
import { stateKey } from "./reducer";

export const namespaceContextState = (state: RootState) => state[stateKey];

export const namespaces = (state: RootState) => {
  return namespaceContextState(state).namespaces;
};
export const namespaceIsFetching = (state: RootState) =>
  namespaceContextState(state).namespacesIsFetching;
export const namespacesFetchError = (state: RootState) =>
  namespaceContextState(state).namespacesFetchError;

export const currentNamespace = (state: RootState) =>
  namespaceContextState(state).current;
