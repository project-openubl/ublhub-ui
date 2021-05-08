import { Namespace, PageRepresentation } from "api/models";
import { AxiosError, AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { createAsyncAction, createAction } from "typesafe-actions";
import { getNamespaces } from "api/rest";

export const {
  request: fetchNamespacesRequest,
  success: fetchNamespacesSuccess,
  failure: fetchNamespacesFailure,
} = createAsyncAction(
  "context/namespaces/fetch/request",
  "context/namespaces/fetch/success",
  "context/namespaces/fetch/failure"
)<void, Namespace[], AxiosError>();

export const fetchNamespacesContext = () => {
  return (dispatch: Dispatch) => {
    dispatch(fetchNamespacesRequest());

    return getNamespaces({}, { page: 1, perPage: 10_000 })
      .then((res: AxiosResponse<PageRepresentation<Namespace>>) => {
        dispatch(fetchNamespacesSuccess(res.data.data));
      })
      .catch((err: AxiosError) => {
        dispatch(fetchNamespacesFailure(err));
      });
  };
};

export const setNamespaceContext = createAction(
  "context/namespace/set"
)<Namespace>();
