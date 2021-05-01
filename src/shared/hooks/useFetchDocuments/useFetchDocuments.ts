import { useCallback, useReducer } from "react";
import { AxiosError } from "axios";
import { ActionType, createAsyncAction, getType } from "typesafe-actions";

import debounce from "lodash/debounce";

import { UBLDocumentSortByQuery, getDocuments } from "api/rest";
import { PageRepresentation, UBLDocument, PageQuery } from "api/models";

export const {
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure,
} = createAsyncAction(
  "useFetchDocuments/fetch/request",
  "useFetchDocuments/fetch/success",
  "useFetchDocuments/fetch/failure"
)<void, PageRepresentation<UBLDocument>, AxiosError>();

type State = Readonly<{
  isFetching: boolean;
  documents?: PageRepresentation<UBLDocument>;
  fetchError?: AxiosError;
  fetchCount: number;
}>;

const defaultState: State = {
  isFetching: false,
  documents: undefined,
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
        documents: action.payload,
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

//

//

export interface IState {
  documents?: PageRepresentation<UBLDocument>;
  isFetching: boolean;
  fetchError?: AxiosError;
  fetchCount: number;
  fetchDocuments: (
    company: string,
    filters: {
      filterText?: string;
    },
    page: PageQuery,
    sortBy?: UBLDocumentSortByQuery
  ) => void;
  fetchDocumentsStream: (
    company: string,
    filters: {
      filterText?: string;
    },
    page: PageQuery,
    sortBy?: UBLDocumentSortByQuery
  ) => void;
}

export const useFetchDocuments = (
  defaultIsFetching: boolean = false
): IState => {
  const [state, dispatch] = useReducer(reducer, defaultIsFetching, initReducer);

  const fetchDocuments = useCallback(
    (
      company: string,
      filters: {
        filterText?: string;
      },
      page: PageQuery,
      sortBy?: UBLDocumentSortByQuery
    ) => {
      dispatch(fetchRequest());

      getDocuments(company, filters, page, sortBy)
        .then(({ data }) => {
          dispatch(fetchSuccess(data));
        })
        .catch((error: AxiosError) => {
          dispatch(fetchFailure(error));
        });
    },
    []
  );

  // const fetchDocumentsWithAutoRefresh = useCallback(
  //   (
  //     company: string,
  //     filters: {
  //       filterText?: string;
  //     },
  //     page: PageQuery,
  //     sortBy?: UBLDocumentSortByQuery
  //   ) => {
  //     dispatch(fetchRequest());

  //     getDocuments(company, filters, page, sortBy)
  //       .then(({ data }) => {
  //         dispatch(fetchSuccess(data));

  //         const shouldReload = data.data.some((f) => {
  //           return (
  //             f.sunatDeliveryStatus === "SCHEDULED_TO_DELIVER" ||
  //             f.sunatDeliveryStatus === "NEED_TO_CHECK_TICKET"
  //           );
  //         });

  //         if (shouldReload) {
  //           setTimeout(() => {
  //             debouncedFetchDocuments(company, filters, page, sortBy);
  //           }, 1000);
  //         }
  //       })
  //       .catch((error: AxiosError) => {
  //         dispatch(fetchFailure(error));
  //       });
  //   },
  //   []
  // );

  const debouncedFetchDocuments = useCallback(
    debounce(
      (
        company: string,
        filters: {
          filterText?: string;
        },
        page: PageQuery,
        sortBy?: UBLDocumentSortByQuery
      ) => {
        const fetchFn = (
          company: string,
          filters: {
            filterText?: string;
          },
          page: PageQuery,
          sortBy?: UBLDocumentSortByQuery
        ) => {
          dispatch(fetchRequest());

          getDocuments(company, filters, page, sortBy)
            .then(({ data }) => {
              dispatch(fetchSuccess(data));

              const shouldReload = data.data.some((f) => {
                return (
                  f.sunatDeliveryStatus === "SCHEDULED_TO_DELIVER" ||
                  f.sunatDeliveryStatus === "NEED_TO_CHECK_TICKET"
                );
              });

              if (shouldReload) {
                setTimeout(() => {
                  debouncedFetchDocuments(company, filters, page, sortBy);
                }, 1000);
              }
            })
            .catch((error: AxiosError) => {
              dispatch(fetchFailure(error));
            });
        };

        return fetchFn(company, filters, page, sortBy);
      },
      500
    ),
    []
  );

  return {
    documents: state.documents,
    isFetching: state.isFetching,
    fetchError: state.fetchError,
    fetchCount: state.fetchCount,
    fetchDocuments,
    fetchDocumentsStream: debouncedFetchDocuments,
  };
};

export default useFetchDocuments;
