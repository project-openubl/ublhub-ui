import { useCallback, useReducer } from "react";
import { AxiosError } from "axios";
import { ActionType, createAsyncAction, getType } from "typesafe-actions";

import { getCompanies } from "api/rest";
import {
  PageRepresentation,
  Company,
  PageQuery,
  SortByQuery,
} from "api/models";

export const {
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure,
} = createAsyncAction(
  "useFetchCompanies/fetch/request",
  "useFetchCompanies/fetch/success",
  "useFetchCompanies/fetch/failure"
)<void, PageRepresentation<Company>, AxiosError>();

type State = Readonly<{
  isFetching: boolean;
  companies?: PageRepresentation<Company>;
  fetchError?: AxiosError;
  fetchCount: number;
}>;

const defaultState: State = {
  isFetching: false,
  companies: undefined,
  fetchError: undefined,
  fetchCount: 0,
};

type Action = ActionType<
  typeof fetchRequest | typeof fetchSuccess | typeof fetchFailure
>;

const initReducer = (isFetching: boolean): State => {
  return {
    ...defaultState,
    isFetching,
  };
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case getType(fetchRequest):
      return {
        ...state,
        isFetching: true,
      };
    case getType(fetchSuccess):
      return {
        ...state,
        isFetching: false,
        fetchError: undefined,
        companies: action.payload,
        fetchCount: state.fetchCount + 1,
      };
    case getType(fetchFailure):
      return {
        ...state,
        isFetching: false,
        fetchError: action.payload,
        fetchCount: state.fetchCount + 1,
      };
    default:
      return state;
  }
};

export interface IState {
  companies?: PageRepresentation<Company>;
  isFetching: boolean;
  fetchError?: AxiosError;
  fetchCount: number;
  fetchCompanies: (
    page: PageQuery,
    sortBy?: SortByQuery,
    filterText?: string
  ) => void;
}

export const useFetchCompanies = (
  defaultIsFetching: boolean = false
): IState => {
  const [state, dispatch] = useReducer(reducer, defaultIsFetching, initReducer);

  const fetchCompanies = useCallback(
    (page: PageQuery, sortBy?: SortByQuery, filterText?: string) => {
      dispatch(fetchRequest());

      getCompanies(page, sortBy, filterText)
        .then(({ data }) => {
          dispatch(fetchSuccess(data));
        })
        .catch((error: AxiosError) => {
          dispatch(fetchFailure(error));
        });
    },
    []
  );

  return {
    companies: state.companies,
    isFetching: state.isFetching,
    fetchError: state.fetchError,
    fetchCount: state.fetchCount,
    fetchCompanies,
  };
};

export default useFetchCompanies;
