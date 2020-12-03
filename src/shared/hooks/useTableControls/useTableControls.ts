import { useCallback, useReducer } from "react";
import { ActionType, createAction, getType } from "typesafe-actions";
import {
  IExtraColumnData,
  ISortBy,
  SortByDirection,
} from "@patternfly/react-table";

const setFilterText = createAction("app-table/filterText/change")<string>();
const setSortBy = createAction("app-table/sortBy/change")<ISortBy>();
const setPagination = createAction("app-table/pagination/change")<{
  page: number;
  perPage: number;
}>();

type State = Readonly<{
  changed: boolean;

  filterText: string;
  paginationParams: {
    page: number;
    perPage: number;
  };
  sortBy: ISortBy | undefined;
}>;

const defaultState: State = {
  changed: false,

  filterText: "",
  paginationParams: {
    page: 1,
    perPage: 10,
  },
  sortBy: undefined,
};

type Action = ActionType<
  typeof setFilterText | typeof setSortBy | typeof setPagination
>;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case getType(setFilterText):
      return {
        ...state,
        changed: true,
        filterText: action.payload,
        paginationParams: { page: 1, perPage: state.paginationParams.perPage },
      };
    case getType(setPagination):
      return {
        ...state,
        changed: true,
        paginationParams: {
          page: action.payload.page,
          perPage: action.payload.perPage,
        },
      };
    case getType(setSortBy):
      return {
        ...state,
        changed: true,
        sortBy: {
          index: action.payload.index,
          direction: action.payload.direction,
        },
      };
    default:
      return state;
  }
};

// Hook

interface HookState {
  filterText: string;
  pagination: { page: number; perPage: number };
  sortBy?: ISortBy;
  handleFilterTextChange: (filterText: string) => void;
  handlePaginationChange: ({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }) => void;
  handleSortChange: (
    event: React.MouseEvent,
    index: number,
    direction: SortByDirection,
    extraData: IExtraColumnData
  ) => void;
}

export const useTableControls = (): HookState => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const handleFilterTextChange = useCallback((filterText: string) => {
    dispatch(setFilterText(filterText));
  }, []);

  const handlePaginationChange = useCallback(
    ({ page, perPage }: { page: number; perPage: number }) => {
      dispatch(setPagination({ page, perPage }));
    },
    []
  );

  const handleSortChange = useCallback(
    (
      _: React.MouseEvent,
      index: number,
      direction: SortByDirection,
      extraData: IExtraColumnData
    ) => {
      console.log(extraData);
      const newSortBy = { index, direction };
      dispatch(setSortBy(newSortBy));
    },
    []
  );

  return {
    filterText: state.filterText,
    pagination: state.paginationParams,
    sortBy: state.sortBy,
    handleFilterTextChange,
    handlePaginationChange,
    handleSortChange,
  };
};
