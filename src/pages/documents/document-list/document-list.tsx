import React, { useCallback, useEffect, useState } from "react";
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
import { UBLDocumentSortBy, UBLDocumentSortByQuery } from "api/rest";

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

const DOCUMENT_FIELD = "document";

const getRow = (rowData: IRowData): UBLDocument => {
  return rowData[DOCUMENT_FIELD];
};

export interface DocumentListProps extends RouteComponentProps {}

export const DocumentList: React.FC<DocumentListProps> = () => {
  const history = useHistory();
  const params = useParams<CompanytRoute>();

  const [filterText, setFilterText] = useState("");

  const {
    documents,
    isFetching,
    fetchError,
    fetchDocuments,
  } = useFetchDocuments(true);

  const {
    paginationQuery,
    sortByQuery,
    handlePaginationChange,
    handleSortChange,
  } = useTableControls();

  const refreshTable = useCallback(() => {
    fetchDocuments(
      params.company,
      {
        filterText,
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [filterText, paginationQuery, sortByQuery, fetchDocuments]);

  useEffect(() => {
    fetchDocuments(
      params.company,
      {
        filterText,
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [filterText, paginationQuery, sortByQuery, fetchDocuments]);

  const columns: ICell[] = [
    { title: "Ruc" },
    { title: "ID", transforms: [sortable] },
    { title: "Type" },
    { title: "Status" },
  ];

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
        <SimplePageSection title="Documents" />
        <PageSection>
          <AppTableWithControls
            count={documents ? documents.meta.count : 0}
            items={documents ? documents.data : []}
            itemsToRow={itemsToRow}
            pagination={paginationQuery}
            sortBy={sortByQuery}
            handlePaginationChange={handlePaginationChange}
            handleSortChange={handleSortChange}
            columns={columns}
            actions={actions}
            isLoading={isFetching}
            loadingVariant="skeleton"
            fetchError={fetchError}
            filtersApplied={filterText.trim().length > 0}
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
