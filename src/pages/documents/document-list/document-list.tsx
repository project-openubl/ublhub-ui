import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Moment from "react-moment";
import useWebSocket from "react-use-websocket";
import { saveAs } from "file-saver";
import { useKeycloak } from "@react-keycloak/web";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import {
  Button,
  ButtonVariant,
  Modal,
  PageSection,
  ToolbarChip,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup,
} from "@patternfly/react-core";
import {
  cellWidth,
  compoundExpand,
  IAction,
  ICell,
  IExtraData,
  IRow,
  IRowData,
  ISeparator,
  TableText,
} from "@patternfly/react-table";
import { FilterIcon } from "@patternfly/react-icons";

import {
  AppPlaceholder,
  AppTableWithControls,
  ConditionalRender,
  SearchFilter,
  SimplePageSection,
} from "shared/components";
import {
  useTableControls,
  useColSelectionState,
  useFetch,
  useToolbarFilter,
} from "shared/hooks";

import { NamespaceRoute, formatPath, Paths } from "Paths";
import { UBLDocument, SortByQuery, PageRepresentation } from "api/models";
import {
  getDocumentCdrFile,
  getDocumentFile,
  getDocuments,
  retrySendDocument,
  UBLDocumentSortBy,
  UBLDocumentSortByQuery,
} from "api/rest";

import { CellXML } from "./components/cell-xml";
import { CellSUNAT } from "./components/cell-sunat";
import { CellSystem } from "./components/cell-system";
import { CellXMLExpanded } from "./components/cell-xml-expanded";
import { CellSUNATExpanded } from "./components/cell-sunat-expanded";
import { CellSystemExpanded } from "./components/cell-system-expanded";
import { SelectCompanyFilter } from "./components/select-company-filter";
import { SelectDocumentTypeFilter } from "./components/select-document-type-filter";
import { FileViewer } from "./components/file-viewer";
import { getAxiosErrorMessage } from "utils/modelUtils";

const loc = window.location;
let wsURI: string;
if (loc.protocol === "https:") {
  wsURI = "wss:";
} else {
  wsURI = "ws:";
}
wsURI += "//" + loc.host;

export const extractFilenameFrom = (disposition: string) => {
  let filename = "";
  if (disposition && disposition.indexOf("attachment") !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, "");
    }
  }

  return filename;
};

enum FilterKey {
  RUC = "RUC",
  DOCUMENT_TYPE = "Tipo documento",
}

const toSortByQuery = (
  sortBy?: SortByQuery
): UBLDocumentSortByQuery | undefined => {
  if (!sortBy) {
    return undefined;
  }

  let field: UBLDocumentSortBy;
  switch (sortBy.index) {
    case 0:
      field = UBLDocumentSortBy.DOCUMENT_ID;
      break;
    default:
      return undefined;
  }

  return {
    field,
    direction: sortBy.direction,
  };
};

const ROW_VALUE = "rowValue";

const getRow = (rowData: IRowData): UBLDocument => {
  return rowData[ROW_VALUE];
};

export const DocumentList: React.FC = () => {
  // Keycloak
  const { keycloak } = useKeycloak();

  // Redux
  const dispatch = useDispatch();

  // Router
  const history = useHistory();
  const { namespaceId } = useParams<NamespaceRoute>();

  // Edit
  const [rowToEdit, setRowToEdit] = useState<UBLDocument>();

  // Filters

  const [filterText, setFilterText] = useState("");
  const {
    filters: filtersValue,
    isPresent: areFiltersPresent,
    removeFilter,
    setFilter,
    clearAllFilters,
  } = useToolbarFilter<ToolbarChip>();

  const filters = [
    {
      key: FilterKey.RUC,
      name: "RUC",
      component: (
        <SelectCompanyFilter
          namespaceId={namespaceId}
          value={filtersValue.get(FilterKey.RUC)}
          onApplyFilter={(values) => setFilter(FilterKey.RUC, values)}
        />
      ),
    },
    {
      key: FilterKey.DOCUMENT_TYPE,
      name: "Documento",
      component: (
        <SelectDocumentTypeFilter
          value={filtersValue.get(FilterKey.DOCUMENT_TYPE)}
          onApplyFilter={(values) => setFilter(FilterKey.DOCUMENT_TYPE, values)}
        />
      ),
    },
  ];

  // Table data

  const {
    paginationQuery,
    sortByQuery,
    handlePaginationChange,
    handleSortChange,
  } = useTableControls();

  const fetchDocuments = useCallback(() => {
    const rucs = (filtersValue.get(FilterKey.RUC) || []).map((f) => f.key);
    const documentTypes = (filtersValue.get(FilterKey.DOCUMENT_TYPE) || []).map(
      (f) => f.key
    );

    return getDocuments(
      namespaceId,
      {
        filterText: filterText,
        ruc: rucs,
        documentType: documentTypes,
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [filterText, filtersValue, namespaceId, paginationQuery, sortByQuery]);

  const {
    data: documents,
    isFetching: isFetchingDocuments,
    fetchError: fetchErrorDocuments,
    requestFetch: refreshDocumentsTable,
  } = useFetch<PageRepresentation<UBLDocument>>({
    debounceWait: 100,
    defaultIsFetching: true,
    onFetch: fetchDocuments,
  });

  // WS events
  const [socketUrl, setSocketUrl] = useState(
    `${wsURI}/namespaces/${namespaceId}/documents`
  );

  useEffect(() => {
    setSocketUrl(`${wsURI}/namespaces/${namespaceId}/documents`);
  }, [namespaceId]);

  const { lastMessage: wsEvent, sendJsonMessage: sendWsMessage } = useWebSocket(
    socketUrl,
    {
      onOpen: () => {
        sendWsMessage({
          authentication: {
            token: keycloak.token,
          },
        });
      },
      shouldReconnect: (event: CloseEvent) => event.code !== 1011,
      share: true,
    }
  );

  // Fetch table data

  useEffect(() => {
    refreshDocumentsTable();
  }, [
    wsEvent,
    filterText,
    paginationQuery,
    sortByQuery,
    refreshDocumentsTable,
  ]);

  // Table behavior

  const {
    isColSelected: isColumnExpanded,
    toggleSelectedColSingle: toggleColumnExpanded,
  } = useColSelectionState<UBLDocument>({
    rows: documents?.data || [],
    isEqual: (a, b) => a.id === b.id,
  });

  const columns: ICell[] = [
    { title: "Id", cellTransforms: [], transforms: [cellWidth(15)] },
    { title: "RUC", cellTransforms: [cellWidth(10)], transforms: [] },
    { title: "XML", cellTransforms: [compoundExpand], transforms: [] },
    { title: "SUNAT", cellTransforms: [compoundExpand] },
    { title: "System", cellTransforms: [compoundExpand] },
    { title: "Creado", cellTransforms: [] },
  ];

  const actionResolver = (rowData: IRowData): (IAction | ISeparator)[] => {
    const row: UBLDocument = getRow(rowData);
    if (!row) {
      return [];
    }

    const actions: (IAction | ISeparator)[] = [];

    actions.push(
      {
        title: "Ver XML",
        onClick: (
          event: React.MouseEvent,
          rowIndex: number,
          rowData: IRowData
        ) => {
          const row: UBLDocument = getRow(rowData);
          setRowToEdit(row);
        },
      },
      {
        title: "Descargar XML",
        onClick: (
          event: React.MouseEvent,
          rowIndex: number,
          rowData: IRowData
        ) => {
          const row: UBLDocument = getRow(rowData);
          getDocumentFile(namespaceId, row.id!).then((response) => {
            const contentDisposition = response.headers["content-disposition"];
            const fileName = extractFilenameFrom(contentDisposition);
            saveAs(new Blob([response.data]), fileName || "file.xml");
          });
        },
      }
    );

    if (row.sunat?.hasCdr) {
      actions.push({
        title: "Descargar CDR",
        onClick: (
          event: React.MouseEvent,
          rowIndex: number,
          rowData: IRowData
        ) => {
          const row: UBLDocument = getRow(rowData);
          getDocumentCdrFile(namespaceId, row.id!).then((response) => {
            const contentDisposition = response.headers["content-disposition"];
            const fileName = extractFilenameFrom(contentDisposition);
            saveAs(new Blob([response.data]), fileName || "file.zip");
          });
        },
      });
    }

    if (row.error) {
      actions.push({
        title: "Reenviar a SUNAT",
        onClick: (
          event: React.MouseEvent,
          rowIndex: number,
          rowData: IRowData
        ) => {
          const row: UBLDocument = getRow(rowData);
          retrySendDocument(namespaceId, row.id!)
            .then(() => {
              dispatch(alertActions.addSuccessAlert("Reenvío programado"));
            })
            .catch((error) => {
              dispatch(alertActions.addErrorAlert(getAxiosErrorMessage(error)));
            });
        },
      });
    }

    return actions;
  };

  const XMLColIndex = 2;
  const SUNATColIndex = 3;
  const SYSTEMColIndex = 4;

  const rows: IRow[] = [];
  documents?.data.forEach((item) => {
    const isXMLColumnExpanded = isColumnExpanded(item, XMLColIndex);
    const isSUNATColumnExpanded = isColumnExpanded(item, SUNATColIndex);
    const isSYSTEMColumnExpanded = isColumnExpanded(item, SYSTEMColIndex);

    const isRowOpen =
      isXMLColumnExpanded && isSUNATColumnExpanded && isSYSTEMColumnExpanded;

    rows.push({
      [ROW_VALUE]: item,
      isOpen: isRowOpen,
      cells: [
        {
          title: (
            <TableText wrapModifier="truncate" tooltip={item.id}>
              {item.id}
            </TableText>
          ),
        },
        {
          title: item.fileContent?.ruc || "-",
        },
        {
          title: <CellXML ublDocument={item} />,
          props: {
            isOpen: isXMLColumnExpanded,
          },
        },
        {
          title: <CellSUNAT ublDocument={item} />,
          props: {
            isOpen: isSUNATColumnExpanded,
          },
        },
        {
          title: <CellSystem ublDocument={item} />,
          props: {
            isOpen: isSYSTEMColumnExpanded,
          },
        },
        {
          title: <Moment fromNow>{item.createdOn}</Moment>,
        },
      ],
    });

    if (isXMLColumnExpanded) {
      rows.push({
        parent: rows.length - 1,
        compoundParent: XMLColIndex,
        cells: [
          {
            title: <CellXMLExpanded ublDocument={item} />,
          },
        ],
      });
    }

    if (isSUNATColumnExpanded) {
      rows.push({
        parent: rows.length - 1,
        compoundParent: SUNATColIndex,
        cells: [
          {
            title: <CellSUNATExpanded ublDocument={item} />,
          },
        ],
      });
    }

    if (isSYSTEMColumnExpanded) {
      rows.push({
        parent: rows.length - 1,
        compoundParent: SYSTEMColIndex,
        noPadding: false,
        cells: [
          {
            title: <CellSystemExpanded ublDocument={item} />,
          },
        ],
      });
    }
  });

  // Actions

  const onExpandColumn = (
    event: React.MouseEvent,
    rowIndex: number,
    colIndex: number,
    isOpen: boolean,
    rowData: IRowData,
    extraData: IExtraData
  ) => {
    const row = getRow(rowData);
    toggleColumnExpanded(row, colIndex);
  };

  const redirectToUploadDocumentPage = () => {
    history.push(formatPath(Paths.uploadDocument, { namespaceId }));
  };

  const redirectToCreateDocumentPage = () => {
    history.push(formatPath(Paths.createDocument, { namespaceId }));
  };

  const applyFilterText = (filterText: string) => {
    setFilterText(filterText);
    handlePaginationChange({ page: 1 });
  };

  return (
    <>
      <ConditionalRender
        when={isFetchingDocuments && !(documents || fetchErrorDocuments)}
        then={<AppPlaceholder />}
      >
        <SimplePageSection
          title="Documentos"
          description="Lista de todos los XMLs enviados a la SUNAT."
        />
        <PageSection>
          <AppTableWithControls
            count={documents ? documents.meta.count : 0}
            pagination={paginationQuery}
            sortBy={sortByQuery}
            onPaginationChange={handlePaginationChange}
            onSort={handleSortChange}
            onExpand={onExpandColumn}
            cells={columns}
            rows={rows}
            actionResolver={actionResolver}
            isLoading={isFetchingDocuments}
            loadingVariant="none"
            fetchError={fetchErrorDocuments}
            toolbarClearAllFilters={clearAllFilters}
            filtersApplied={filterText.trim().length > 0 || areFiltersPresent}
            toolbar={
              <>
                <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
                  <ToolbarItem>
                    <SearchFilter onApplyFilter={applyFilterText} />
                  </ToolbarItem>
                  <ToolbarGroup variant="filter-group">
                    {filters.map((f) => (
                      <ToolbarFilter
                        key={f.key}
                        chips={filtersValue.get(f.key)}
                        deleteChip={(_, chip) => removeFilter(f.key, chip)}
                        deleteChipGroup={() => setFilter(f.key, [])}
                        categoryName={{ key: f.key, name: f.name }}
                      >
                        {f.component}
                      </ToolbarFilter>
                    ))}
                  </ToolbarGroup>
                </ToolbarToggleGroup>
                <ToolbarGroup variant="button-group">
                  <ToolbarItem>
                    <Button
                      type="button"
                      aria-label="upload-xml"
                      variant={ButtonVariant.primary}
                      onClick={redirectToCreateDocumentPage}
                    >
                      Nuevo
                    </Button>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button
                      type="button"
                      aria-label="upload-xml"
                      variant={ButtonVariant.secondary}
                      onClick={redirectToUploadDocumentPage}
                    >
                      Importar
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </>
            }
          />
        </PageSection>
      </ConditionalRender>

      <Modal
        isOpen={!!rowToEdit}
        variant="large"
        title={`Documento ${rowToEdit?.fileContent?.documentID}`}
        onClose={() => setRowToEdit(undefined)}
      >
        {rowToEdit && (
          <FileViewer namespaceId={namespaceId} ublDocument={rowToEdit} />
        )}
      </Modal>
    </>
  );
};
