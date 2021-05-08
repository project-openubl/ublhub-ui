import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps, useHistory, useParams } from "react-router-dom";
import { StatusIcon, StatusType } from "@konveyor/lib-ui";
import Moment from "react-moment";

import { useKeycloak } from "@react-keycloak/web";
import useWebSocket from "react-use-websocket";

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
  NotificationDrawer,
  NotificationDrawerBody,
  NotificationDrawerList,
  NotificationDrawerListItem,
  NotificationDrawerListItemBody,
  NotificationDrawerListItemHeader,
  PageSection,
  Title,
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
  BullseyeIcon,
} from "@patternfly/react-icons";

import { DeleteWithMatchModalContainer } from "shared/containers";
import {
  AppPlaceholder,
  AppTableWithControls,
  ConditionalRender,
  DocumentStatus,
  SearchFilter,
  SimplePageSection,
} from "shared/components";
import {
  useTableControls,
  useFetchDocuments,
  useColSelectionState,
} from "shared/hooks";

import { NamespaceRoute, formatPath, Paths } from "Paths";
import {
  UBLDocument,
  SortByQuery,
  UBLDocumentSunat,
  WsMessage,
} from "api/models";
import { UBLDocumentSortBy, UBLDocumentSortByQuery } from "api/rest";

import sunatLogo from "images/sunat.png";

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
      throw new Error("Invalid column index=" + sortBy.index);
  }

  return {
    field,
    direction: sortBy.direction,
  };
};

const ENTITY_FIELD = "entity";

const getRow = (rowData: IRowData): UBLDocument => {
  return rowData[ENTITY_FIELD];
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

export interface DocumentListProps extends RouteComponentProps {}

export const DocumentList: React.FC<DocumentListProps> = () => {
  const history = useHistory();
  const params = useParams<NamespaceRoute>();
  const { keycloak } = useKeycloak();

  const [filterText, setFilterText] = useState("");

  const {
    documents,
    isFetching,
    fetchError,
    fetchDocumentsStream,
  } = useFetchDocuments(true);

  const {
    paginationQuery,
    sortByQuery,
    handlePaginationChange,
    handleSortChange,
  } = useTableControls();

  const refreshTable = useCallback(() => {
    fetchDocumentsStream(
      params.namespaceId,
      {
        filterText,
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [params, filterText, paginationQuery, sortByQuery, fetchDocumentsStream]);

  useEffect(() => {
    fetchDocumentsStream(
      params.namespaceId,
      {
        filterText,
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [params, filterText, paginationQuery, sortByQuery, fetchDocumentsStream]);

  const [socketUrl, setSocketUrl] = useState(
    `ws://localhost:8080/companies/${params.namespaceId}/documents`
  );
  useEffect(() => {
    if (params.namespaceId) {
      setSocketUrl(`ws://localhost:8080/companies/${params.namespaceId}/documents`);
    }
  }, [params]);

  const {
    lastJsonMessage: eventMsg,
    sendJsonMessage: sendEventMessage,
  } = useWebSocket(socketUrl, {
    onOpen: () => {
      sendEventMessage({
        authentication: {
          token: keycloak.token,
        },
      });
    },
    shouldReconnect: (event: CloseEvent) => event.code !== 1011,
    share: true,
  });

  useEffect(() => {
    if (eventMsg) {
      const event: WsMessage = eventMsg as WsMessage;

      switch (event.spec.event) {
        case "CREATED":
          if (
            paginationQuery.page === 1 &&
            !sortByQuery &&
            !(documents?.data || []).find((f) => f.id === event.spec.id)
          ) {
            refreshTable();
          }
          break;
        case "DELETED":
          if (documents && documents.data.find((f) => f.id === event.spec.id)) {
            refreshTable();
          }
          break;
      }
    }
  }, [eventMsg, documents, paginationQuery, sortByQuery, refreshTable]);

  //

  const columns: ICell[] = [
    {
      title: "Id",
      cellTransforms: [],
      transforms: [cellWidth(15)],
    },
    {
      title: "XML",
      cellTransforms: [compoundExpand],
      transforms: [cellWidth(40)],
    },
    { title: "SUNAT", cellTransforms: [compoundExpand], transforms: [] },
    { title: "Events", cellTransforms: [compoundExpand], transforms: [] },
    { title: "Created on", cellTransforms: [] },
  ];

  const {
    isColSelected: isColumnExpanded,
    toggleSelectedColSingle: toggleColumnExpanded,
  } = useColSelectionState<UBLDocument>({
    rows: documents?.data || [],
    isEqual: (a, b) => a.id === b.id,
  });

  const rows: IRow[] = [];
  documents?.data.forEach((item) => {
    const is2ndColumnExpanded = isColumnExpanded(item, 1);
    const is3rdColumnExpanded = isColumnExpanded(item, 2);
    const is4thColumnExpanded = isColumnExpanded(item, 3);

    rows.push({
      [ENTITY_FIELD]: item,
      isOpen: is2ndColumnExpanded && is3rdColumnExpanded && is4thColumnExpanded,
      cells: [
        {
          title: (
            <TableText wrapModifier="truncate" tooltip={item.id}>
              {(item.sunatDeliveryStatus === "SCHEDULED_TO_DELIVER" ||
                item.sunatDeliveryStatus === "NEED_TO_CHECK_TICKET") && (
                <>
                  <DocumentStatus status="InProgress" />
                  &nbsp;
                </>
              )}
              {item.sunatDeliveryStatus === "DELIVERED" && (
                <>
                  <img
                    src={sunatLogo}
                    height="16"
                    width="16"
                    alt="SUNAT logo"
                  />
                  &nbsp;
                </>
              )}
              {item.id}
            </TableText>
          ),
        },
        {
          props: {
            isOpen: is2ndColumnExpanded,
          },
          title: (
            <>
              {item.fileContentValid === true && item.fileContent && (
                <>
                  <FileCodeIcon key="fileCode-icon" />{" "}
                  {item.fileContent?.documentID}
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
            isOpen: is3rdColumnExpanded,
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
            isOpen: is4thColumnExpanded,
          },
          title: (
            <>
              <BullseyeIcon key="bullseye-icon" /> {item.sunatEvents.length}
            </>
          ),
        },
        {
          title: <Moment fromNow>{item.createdOn}</Moment>,
        },
      ],
    });

    if (is2ndColumnExpanded) {
      rows.push({
        parent: rows.length - 1,
        compoundParent: 1,
        cells: [
          {
            title: (
              <DescriptionList className="pf-c-table__expandable-row-content">
                <DescriptionListGroup>
                  <DescriptionListTerm>Document type</DescriptionListTerm>
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
    if (is3rdColumnExpanded) {
      rows.push({
        parent: rows.length - 1,
        compoundParent: 2,
        cells: [
          {
            title: (
              <DescriptionList className="pf-c-table__expandable-row-content">
                <DescriptionListGroup>
                  <DescriptionListTerm>Status</DescriptionListTerm>
                  <DescriptionListDescription>
                    {item.sunat?.status}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Code</DescriptionListTerm>
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
                  <DescriptionListTerm>Description</DescriptionListTerm>
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
    if (is4thColumnExpanded) {
      rows.push({
        parent: rows.length - 1,
        compoundParent: 3,
        noPadding: true,
        cells: [
          {
            title: (
              <NotificationDrawer>
                <NotificationDrawerBody>
                  <NotificationDrawerList>
                    {item.sunatEvents.map((event, index) => (
                      <NotificationDrawerListItem
                        key={index}
                        variant={event.status}
                        isRead
                      >
                        <NotificationDrawerListItemHeader
                          variant={event.status}
                          title={event.description}
                          srTitle={event.description}
                        ></NotificationDrawerListItemHeader>
                        <NotificationDrawerListItemBody
                          timestamp={<Moment fromNow>{item.createdOn}</Moment>}
                        ></NotificationDrawerListItemBody>
                      </NotificationDrawerListItem>
                    ))}
                  </NotificationDrawerList>
                </NotificationDrawerBody>
              </NotificationDrawer>
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

  //

  const handleOnNewCompany = () => {
    history.push(formatPath(Paths.newDocument, { company: params.namespaceId }));
  };

  const handleOnFilterApplied = (filterText: string) => {
    setFilterText(filterText);
    handlePaginationChange({ page: 1 });
  };

  return (
    <>
      <ConditionalRender
        when={isFetching && !(documents || fetchError)}
        then={<AppPlaceholder />}
      >
        <SimplePageSection title="Documents" />
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
            isLoading={isFetching}
            loadingVariant="none"
            fetchError={fetchError}
            filtersApplied={filterText.trim().length > 0}
            toolbarToggle={
              <ToolbarGroup variant="filter-group">
                <SearchFilter onApplyFilter={handleOnFilterApplied} />
              </ToolbarGroup>
            }
            toolbar={
              <ToolbarGroup variant="button-group">
                <ToolbarItem>
                  <Button
                    type="button"
                    aria-label="new-document"
                    variant={ButtonVariant.primary}
                    onClick={handleOnNewCompany}
                  >
                    New document
                  </Button>
                </ToolbarItem>
              </ToolbarGroup>
            }
            noDataState={
              <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateIcon icon={AddCircleOIcon} />
                <Title headingLevel="h2" size="lg">
                  No documents available
                </Title>
                <EmptyStateBody>
                  Add a documents by clicking on <strong>New document</strong>.
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
