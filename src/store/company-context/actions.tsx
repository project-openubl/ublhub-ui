import { Company, PageRepresentation } from "api/models";
import { AxiosError, AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { createAsyncAction, createAction } from "typesafe-actions";
import { getCompanies } from "api/rest";

export const {
  request: fetchCompaniesRequest,
  success: fetchCompaniesSuccess,
  failure: fetchCompaniesFailure,
} = createAsyncAction(
  "context/companies/fetch/request",
  "context/companies/fetch/success",
  "context/companies/fetch/failure"
)<void, Company[], AxiosError>();

export const fetchCompaniesContext = () => {
  return (dispatch: Dispatch) => {
    dispatch(fetchCompaniesRequest());

    return getCompanies({}, { page: 1, perPage: 10_000 })
      .then((res: AxiosResponse<PageRepresentation<Company>>) => {
        dispatch(fetchCompaniesSuccess(res.data.data));
      })
      .catch((err: AxiosError) => {
        dispatch(fetchCompaniesFailure(err));
      });
  };
};

export const setCompanyContext = createAction("context/company/set")<string>();
