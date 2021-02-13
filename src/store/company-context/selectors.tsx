import { RootState } from "../rootReducer";
import { stateKey } from "./reducer";

export const companyContextState = (state: RootState) => state[stateKey];

export const companies = (state: RootState) => {
  return companyContextState(state).companies;
};
export const companiesIsFetching = (state: RootState) =>
  companyContextState(state).companiesIsFetching;
export const companiesFetchError = (state: RootState) =>
  companyContextState(state).companiesFetchError;

export const currentCompany = (state: RootState) =>
  companyContextState(state).current;
