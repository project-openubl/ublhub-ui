import { useState, useCallback } from "react";
import { AxiosError } from "axios";

import { getCompanies } from "api/rest";
import {
  PageRepresentation,
  Company,
  PageQuery,
  SortByQuery,
} from "api/models";

export interface IState {
  companies?: PageRepresentation<Company>;
  isFetching: boolean;
  fetchError?: AxiosError;
  refresh: (page: PageQuery, sortBy?: SortByQuery, filterText?: string) => void;
}

export const useFetchCompany = (): IState => {
  const [companies, setCompanies] = useState<PageRepresentation<Company>>();
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<AxiosError>();

  const refresh = useCallback(
    (page: PageQuery, sortBy?: SortByQuery, filterText?: string) => {
      setIsFetching(true);

      getCompanies(page, sortBy, filterText)
        .then(({ data }) => {
          setCompanies(data);
          setFetchError(undefined);
        })
        .catch((error: AxiosError) => {
          setFetchError(error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    },
    []
  );

  return {
    companies,
    isFetching,
    fetchError,
    refresh,
  };
};

export default useFetchCompany;
