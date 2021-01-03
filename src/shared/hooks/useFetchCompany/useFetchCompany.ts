import { useCallback, useReducer } from "react";
import { AxiosError } from "axios";
import { ActionType, createAsyncAction, getType } from "typesafe-actions";

import { getCompany } from "api/rest";
import { Company } from "api/models";

export const {
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure,
} = createAsyncAction(
  "useFetchCompany/fetch/request",
  "useFetchCompany/fetch/success",
  "useFetchCompany/fetch/failure"
)<void, Company, AxiosError>();

type State = Readonly<{
  isFetching: boolean;
  company?: Company;
  fetchError?: AxiosError;
}>;

const defaultState: State = {
  isFetching: false,
  company: undefined,
  fetchError: undefined,
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
        company: action.payload,
      };
    case getType(fetchFailure):
      return {
        ...state,
        isFetching: false,
        fetchError: action.payload,
      };
    default:
      return state;
  }
};

export interface IState {
  company?: Company;
  isFetching: boolean;
  fetchError?: AxiosError;
  fetchCompany: (name: string) => void;
}

export const useFetchCompany = (defaultIsFetching: boolean = false): IState => {
  const [state, dispatch] = useReducer(reducer, defaultIsFetching, initReducer);

  const fetchCompany = useCallback((name: string) => {
    dispatch(fetchRequest());

    getCompany(name)
      .then(({ data }) => {
        dispatch(fetchSuccess(data));
      })
      .catch((error: AxiosError) => {
        dispatch(fetchFailure(error));
      });
  }, []);

  return {
    company: state.company,
    isFetching: state.isFetching,
    fetchError: state.fetchError,
    fetchCompany,
  };
};

export default useFetchCompany;
