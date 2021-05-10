import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { StatusIcon, StatusType } from "@konveyor/lib-ui";
import Moment from "react-moment";

import { useKeycloak } from "@react-keycloak/web";

import {
  Button,
  ButtonVariant,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  PageSection,
  Title,
  ToolbarChip,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  cellWidth,
  compoundExpand,
  ICell,
  IExtraData,
  IRow,
  IRowData,
  TableText,
} from "@patternfly/react-table";
import {
  AddCircleOIcon,
  FileCodeIcon,
} from "@patternfly/react-icons";

import { DeleteWithMatchModalContainer } from "shared/containers";
import {
  AppPlaceholder,
  AppTableToolbarToggleGroup,
  AppTableWithControls,
  ConditionalRender,
  DocumentStatus,
  SearchFilter,
  SimplePageSection,
} from "shared/components";
import { useTableControls, useColSelectionState, useFetch } from "shared/hooks";

import { NamespaceRoute, formatPath, Paths } from "Paths";
import {
  UBLDocument,
  SortByQuery,
  UBLDocumentSunat,
  PageRepresentation,
} from "api/models";
import {
  getDocuments,
  UBLDocumentSortBy,
  UBLDocumentSortByQuery,
} from "api/rest";
import { SelectCompanyFilter } from "./components/select-company-filter";
import { SelectDocumentTypeFilter } from "./components/select-document-type-filter";

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

const getStatusType = (ublDocument: UBLDocumentSunat): StatusType => {
  switch (ublDocument.status) {
    case "ACEPTADO":
      return "Ok";
    case "RECHAZADO":
      return "Error";
    case "EXCEPCION":
      return "Error";
    case "BAJA":
      return "Warning";
    case "EN_PROCESO":
      return "Warning";
    default:
      return "Unknown";
  }
};

const formatSunatStatus = (status: string) => {
  const withSpace = status.replace(/_/g, " ").toLowerCase();
  return withSpace.charAt(0).toUpperCase() + withSpace.slice(1);
};

export const DocumentList: React.FC = () => {
  const history = useHistory();
  const { namespaceId } = useParams<NamespaceRoute>();

  const { keycloak } = useKeycloak();

  const filters = [
    {
      key: FilterKey.RUC,
      name: "RUC",
    },
    {
      key: FilterKey.DOCUMENT_TYPE,
      name: "Tipo documento",
    },
  ];

  const [filterText, setFilterText] = useState("");
  const [filtersValue, setFiltersValue] = useState<
    Map<FilterKey, ToolbarChip[]>
  >(new Map([]));

  const {
    paginationQuery,
    sortByQuery,
    handlePaginationChange,
    handleSortChange,
  } = useTableControls();

  const fetchDocuments = useCallback(() => {
    return getDocuments(
      namespaceId,
      {
        filterText: filterText,
        ruc: filtersValue.get(FilterKey.RUC)?.map((f) => f.key),
        documentType: filtersValue
          .get(FilterKey.DOCUMENT_TYPE)
          ?.map((f) => f.key),
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
    defaultIsFetching: true,
    onFetch: fetchDocuments,
  });

  useEffect(() => {
    refreshDocumentsTable();
  }, [filterText, paginationQuery, sortByQuery, refreshDocumentsTable]);

  //

  // const [socketUrl, setSocketUrl] = useState(
  //   `ws://localhost:8080/namespaces/${namespaceId}/documents`
  // );

  // useEffect(() => {
  //   if (namespaceId) {
  //     setSocketUrl(`ws://localhost:8080/namespaces/${namespaceId}/documents`);
  //   }
  // }, [namespaceId]);

  // const {
  //   lastJsonMessage: eventMsg,
  //   sendJsonMessage: sendEventMessage,
  // } = useWebSocket(socketUrl, {
  //   onOpen: () => {
  //     sendEventMessage({
  //       authentication: {
  //         token: keycloak.token,
  //       },
  //     });
  //   },
  //   shouldReconnect: (event: CloseEvent) => event.code !== 1011,
  //   share: true,
  // });

  // useEffect(() => {
  //   if (eventMsg) {
  //     const event: WsMessage = eventMsg as WsMessage;

  //     switch (event.spec.event) {
  //       case "CREATED":
  //         if (
  //           paginationQuery.page === 1 &&
  //           !sortByQuery &&
  //           !(documents?.data || []).find((f) => f.id === event.spec.id)
  //         ) {
  //           refreshDocumentsTable();
  //         }
  //         break;
  //       case "DELETED":
  //         if (documents && documents.data.find((f) => f.id === event.spec.id)) {
  //           refreshDocumentsTable();
  //         }
  //         break;
  //     }
  //   }
  // }, [
  //   eventMsg,
  //   documents,
  //   paginationQuery,
  //   sortByQuery,
  //   refreshDocumentsTable,
  // ]);

  // Table

  const {
    isColSelected: isColumnExpanded,
    toggleSelectedColSingle: toggleColumnExpanded,
  } = useColSelectionState<UBLDocument>({
    rows: documents?.data || [],
    isEqual: (a, b) => a.id === b.id,
  });

  const columns: ICell[] = [
    {
      title: "Id",
      cellTransforms: [],
      transforms: [cellWidth(15)],
    },
    {
      title: "RUC",
      cellTransforms: [cellWidth(10)],
      transforms: [],
    },
    {
      title: "XML",
      cellTransforms: [compoundExpand],
      transforms: [],
    },
    {
      title: "SUNAT",
      cellTransforms: [compoundExpand],
      // transforms: [cellWidth(10)],
    },
    {
      title: "System",
      cellTransforms: [compoundExpand],
      // transforms: [cellWidth(10)],
    },
    { title: "Creado", cellTransforms: [] },
  ];

  const XMLColIndex = 2;
  const SUNATColIndex = 3;
  const SYSTEMColIndex = 4;

  const rows: IRow[] = [];
  documents?.data.forEach((item) => {
    const isXMLColumnExpanded = isColumnExpanded(item, XMLColIndex);
    const isSUNATColumnExpanded = isColumnExpanded(item, SUNATColIndex);
    const isSYSTEMColumnExpanded = isColumnExpanded(item, SYSTEMColIndex);

    let systemColumnValue;
    if (item.inProgress) {
      systemColumnValue = <StatusIcon status="Loading" label="En proceso" />;
    } else if (item.error) {
      systemColumnValue = <StatusIcon status="Error" label="Error" />;
    } else {
      systemColumnValue = <StatusIcon status="Ok" label="Ok" />;
    }

    rows.push({
      [ROW_VALUE]: item,
      isOpen:
        isXMLColumnExpanded && isSUNATColumnExpanded && isSYSTEMColumnExpanded,
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
          props: {
            isOpen: isXMLColumnExpanded,
          },
          title: (
            <>
              {item.fileContentValid === true && item.fileContent && (
                <>
                  <FileCodeIcon key="fileCode-icon" />{" "}
                  {item.fileContent.documentID}
                </>
              )}
              {item.fileContentValid === false && (
                <DocumentStatus
                  status="Error"
                  label={`Error: ${item.fileContentValidationError}`}
                />
              )}
            </>
          ),
        },
        {
          props: {
            isOpen: isSUNATColumnExpanded,
          },
          title: (
            <>
              {item.sunat && item.sunat.status && (
                <StatusIcon
                  status={getStatusType(item.sunat)}
                  label={formatSunatStatus(item.sunat.status)}
                />
              )}
              {item.sunat && !item.sunat.status && (
                <StatusIcon status={"Unknown"} label="Unknown" />
              )}
            </>
          ),
        },
        {
          props: {
            isOpen: isSYSTEMColumnExpanded,
          },
          title: systemColumnValue,
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
            title: (
              <DescriptionList className="pf-c-table__expandable-row-content">
                <DescriptionListGroup>
                  <DescriptionListTerm>Tipo</DescriptionListTerm>
                  <DescriptionListDescription>
                    {item.fileContent?.documentType}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>ID</DescriptionListTerm>
                  <DescriptionListDescription>
                    {item.fileContent?.documentID}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>RUC</DescriptionListTerm>
                  <DescriptionListDescription>
                    {item.fileContent?.ruc}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            ),
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
            title: (
              <DescriptionList className="pf-c-table__expandable-row-content">
                <DescriptionListGroup>
                  <DescriptionListTerm>Estado</DescriptionListTerm>
                  <DescriptionListDescription>
                    {item.sunat?.status}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Código</DescriptionListTerm>
                  <DescriptionListDescription>
                    {item.sunat?.code}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                {item.sunat?.ticket && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Ticket</DescriptionListTerm>
                    <DescriptionListDescription>
                      {item.sunat?.description}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                <DescriptionListGroup>
                  <DescriptionListTerm>Descripción</DescriptionListTerm>
                  <DescriptionListDescription>
                    {item.sunat?.description}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            ),
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
            title: (
              <DescriptionList className="pf-c-table__expandable-row-content">
                <DescriptionListGroup>
                  <DescriptionListTerm>Error</DescriptionListTerm>
                  <DescriptionListDescription>
                    {item.error || "Ninguno"}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            ),
          },
        ],
      });
    }
  });

  // Rows

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

  const addFilter = (key: string, value: ToolbarChip | ToolbarChip[]) => {
    const filterKey: FilterKey = key as FilterKey;

    setFiltersValue((current) => {
      if (Array.isArray(value)) {
        return new Map(current).set(filterKey, value);
      } else {
        const currentChips: ToolbarChip[] = current.get(filterKey) || [];
        return new Map(current).set(filterKey, [...currentChips, value]);
      }
    });

    handlePaginationChange({ page: 1 });
  };

  const deleteFilter = (key: string, value: (string | ToolbarChip)[]) => {
    const filterKey: FilterKey = key as FilterKey;
    setFiltersValue((current) =>
      new Map(current).set(filterKey, value as ToolbarChip[])
    );
  };

  const clearAllFilters = () => {
    setFiltersValue((current) => {
      const newVal = new Map(current);
      Array.from(newVal.keys()).forEach((key) => {
        newVal.set(key, []);
      });
      return newVal;
    });
  };

  //

  const redirectToUploadDocumentPage = () => {
    history.push(formatPath(Paths.uploadDocument, { namespaceId }));
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
            handlePaginationChange={handlePaginationChange}
            handleSortChange={handleSortChange}
            onExpand={onExpandColumn}
            columns={columns}
            rows={rows}
            isLoading={isFetchingDocuments}
            loadingVariant="none"
            fetchError={fetchErrorDocuments}
            clearAllFilters={clearAllFilters}
            filtersApplied={
              filterText.trim().length > 0 ||
              Array.from(filtersValue.values()).reduce(
                (previous, current) => [...previous, ...current],
                []
              ).length > 0
            }
            toolbarToggle={
              <>
                <ToolbarItem>
                  <SearchFilter onApplyFilter={applyFilterText} />
                </ToolbarItem>
                <AppTableToolbarToggleGroup
                  options={filters}
                  filtersValue={filtersValue}
                  onDeleteFilter={deleteFilter}
                >
                  <ToolbarGroup variant="filter-group">
                    <ToolbarFilter
                      chips={[]}
                      deleteChip={() => {}}
                      deleteChipGroup={() => {}}
                      categoryName="Status"
                    >
                      <SelectCompanyFilter
                        namespaceId={namespaceId}
                        value={filtersValue.get(FilterKey.RUC)}
                        onApplyFilter={(values) => {
                          addFilter(FilterKey.RUC, values);
                        }}
                      />
                    </ToolbarFilter>
                    <ToolbarFilter
                      chips={[]}
                      deleteChip={() => {}}
                      categoryName="Risk"
                    >
                      <SelectDocumentTypeFilter
                        value={filtersValue.get(FilterKey.DOCUMENT_TYPE)}
                        onApplyFilter={(values) => {
                          addFilter(FilterKey.DOCUMENT_TYPE, values);
                        }}
                      />
                    </ToolbarFilter>
                  </ToolbarGroup>
                </AppTableToolbarToggleGroup>
              </>
            }
            toolbar={
              <ToolbarGroup variant="button-group">
                <ToolbarItem>
                  <Button
                    type="button"
                    aria-label="upload-xml"
                    variant={ButtonVariant.primary}
                    onClick={redirectToUploadDocumentPage}
                  >
                    Importar XML
                  </Button>
                </ToolbarItem>
              </ToolbarGroup>
            }
            noDataState={
              <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateIcon icon={AddCircleOIcon} />
                <Title headingLevel="h2" size="lg">
                  No existen documentos
                </Title>
                <EmptyStateBody>
                  Importa tus archivos XML haciendo click en{" "}
                  <strong>Importar XML</strong>.
                </EmptyStateBody>
              </EmptyState>
            }
          />
        </PageSection>
      </ConditionalRender>
      <DeleteWithMatchModalContainer />
    </>
  );
};
