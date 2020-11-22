import { useState, useCallback } from "react";
import { AxiosError } from "axios";

import { getCompanies } from "api/rest";
import {
  PageRepresentation,
  Company,
  PageQuery,
  SortByQuery,
} from "api/models";
import { ISortBy } from "@patternfly/react-table";

export interface IState {
  onPaginationChange: (page: number, perPage: number) => void;
  onSortChange: (sortBy: ISortBy) => void;
}

export const usePagination = (): IState => {
  const [filterText, setFilterText] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });
  const [sortBy, setSortBy] = useState<ISortBy>();

  const onFilterTextChange = (filterText: string) => {
    const newParams = { page: 1, perPage: pagination.perPage };

    setFilterText(filterText);
    setPagination(newParams);
  };

  return {
    companies,
    isFetching,
    fetchError,
    refresh,
  };
};

export default usePagination;
