import { Company } from "api/models";
import { AxiosError } from "axios";
import { ActionType, getType } from "typesafe-actions";

import {
  fetchCompaniesRequest,
  fetchCompaniesSuccess,
  fetchCompaniesFailure,
  setCompanyContext,
} from "./actions";

export const stateKey = "companyContext";

export type CompanyContextState = Readonly<{
  current?: string;
  companies: Company[];
  companiesIsFetching: boolean;
  companiesFetchError?: AxiosError;
}>;

export const defaultState: CompanyContextState = {
  current: undefined,
  companies: [],
  companiesIsFetching: false,
  companiesFetchError: undefined,
};

export type CompanyContextAction = ActionType<
  | typeof fetchCompaniesRequest
  | typeof fetchCompaniesSuccess
  | typeof fetchCompaniesFailure
  | typeof setCompanyContext
>;

export function companyContextReducer(
  state = defaultState,
  action: CompanyContextAction
): CompanyContextState {
  switch (action.type) {
    case getType(fetchCompaniesRequest):
      return {
        ...state,
        companiesIsFetching: true,
      };
    case getType(fetchCompaniesSuccess):
      return {
        ...state,
        companies: action.payload,
        companiesFetchError: undefined,
        companiesIsFetching: false,
      };
    case getType(fetchCompaniesFailure):
      return {
        ...state,
        companiesFetchError: action.payload,
        companiesIsFetching: false,
      };

    case getType(setCompanyContext):
      return {
        ...state,
        current: action.payload,
      };

    default:
      return state;
  }
}
