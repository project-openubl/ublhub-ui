import React, { useCallback, useEffect } from "react";
import { RouteComponentProps, useHistory, useParams } from "react-router-dom";

import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  PageSection,
  Title,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  IActions,
  ICell,
  IExtraColumnData,
  IExtraData,
  IRowData,
  sortable,
  SortByDirection,
} from "@patternfly/react-table";
import { AddCircleOIcon } from "@patternfly/react-icons";

import {
  AppPlaceholder,
  AppTableWithControls,
  ConditionalRender,
  SimplePageSection,
} from "shared/components";
import { useTableControls, useFetchDocuments } from "shared/hooks";
import { DeleteWithMatchModalContainer } from "shared/containers";

import { CompanytRoute, formatPath, Paths } from "Paths";
import { UBLDocument, PageQuery, SortByQuery } from "api/models";

const columns: ICell[] = [
  { title: "Ruc" },
  { title: "ID", transforms: [sortable] },
  { title: "Type" },
  { title: "Status" },
];

const columnIndexToField = (
  _: React.MouseEvent,
  index: number,
  direction: SortByDirection,
  extraData: IExtraColumnData
) => {
  switch (index) {
    case 0:
      return "name";
    default:
      throw new Error("Invalid column index=" + index);
  }
};

const DOCUMENT_FIELD = "document";

const getRow = (rowData: IRowData): UBLDocument => {
  return rowData[DOCUMENT_FIELD];
};

const itemsToRow = (items: UBLDocument[]) => {
  return items.map((item) => ({
    [DOCUMENT_FIELD]: item,
    cells: [
      {
        title: item.fileInfo.ruc,
      },
      {
        title: item.fileInfo.documentID,
      },
      {
        title: item.fileInfo.documentType,
      },
      {
        title: item.deliveryStatus,
      },
    ],
  }));
};

export interface DocumentListProps extends RouteComponentProps {}

export const DocumentList: React.FC<DocumentListProps> = () => {
  const history = useHistory();
  const params = useParams<CompanytRoute>();

  const {
    documents,
    isFetching,
    fetchError,
    fetchDocuments,
  } = useFetchDocuments(true);

  const {
    filterText,
    paginationQuery,
    sortByQuery,
    sortBy,
    handleFilterTextChange,
    handlePaginationChange,
    handleSortChange,
  } = useTableControls({ columnToField: columnIndexToField });

  const reloadTable = useCallback(
    (filterText: string, pagination: PageQuery, sortBy?: SortByQuery) => {
      fetchDocuments(params.company, pagination, sortBy, filterText);
    },
    [params, fetchDocuments]
  );

  useEffect(() => {
    reloadTable(filterText, paginationQuery, sortByQuery);
  }, [filterText, paginationQuery, sortByQuery, reloadTable]);

  const actions: IActions = [
    {
      title: "Edit",
      onClick: (
        event: React.MouseEvent,
        rowIndex: number,
        rowData: IRowData,
        extraData: IExtraData
      ) => {
        const row: UBLDocument = getRow(rowData);
        console.log(row);
      },
    },
    {
      title: "Delete",
      onClick: (
        event: React.MouseEvent,
        rowIndex: number,
        rowData: IRowData,
        extraData: IExtraData
      ) => {
        const row: UBLDocument = getRow(rowData);
        console.log(row);
      },
    },
  ];

  const handleOnNewCompany = () => {
    history.push(formatPath(Paths.newDocument, { company: params.company }));
  };

  return (
    <>
      <ConditionalRender
        when={isFetching && !(documents || fetchError)}
        then={<AppPlaceholder />}
      >
        <SimplePageSection
          title="Documents"
          description="Documents are the set of XML files you uploaded."
        />
        <PageSection>
          <AppTableWithControls
            count={documents ? documents.meta.count : 0}
            items={documents ? documents.data : []}
            itemsToRow={itemsToRow}
            pagination={paginationQuery}
            sortBy={sortBy}
            handleFilterTextChange={handleFilterTextChange}
            handlePaginationChange={handlePaginationChange}
            handleSortChange={handleSortChange}
            columns={columns}
            actions={actions}
            isLoading={isFetching}
            loadingVariant="skeleton"
            fetchError={fetchError}
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
            filtersApplied={filterText.trim().length > 0}
            noDataState={
              <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateIcon icon={AddCircleOIcon} />
                <Title headingLevel="h2" size="lg">
                  No documents available
                </Title>
                <EmptyStateBody>
                  Add a documents by clicking on <strong>New company</strong>.
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
