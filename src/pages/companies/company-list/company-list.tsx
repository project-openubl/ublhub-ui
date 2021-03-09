import React, { useCallback, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { useDispatch } from "react-redux";
import useWebSocket from "react-use-websocket";
import { useKeycloak } from "@react-keycloak/web";

import {
  Bullseye,
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
  cellWidth,
  IActions,
  ICell,
  IExtraData,
  IRowData,
  sortable,
} from "@patternfly/react-table";
import { AddCircleOIcon } from "@patternfly/react-icons";

import { alertActions } from "store/alert";
import { deleteWithMatchModalActions } from "store/delete-with-match-modal";

import {
  AppPlaceholder,
  AppTableWithControls,
  ConditionalRender,
  SearchFilter,
  SimplePageSection,
} from "shared/components";
import {
  useTableControls,
  useFetchCompanies,
  useDeleteCompany,
} from "shared/hooks";
import { DeleteWithMatchModalContainer } from "shared/containers";

import { formatPath, Paths } from "Paths";
import { CompanySortBy, CompanySortByQuery } from "api/rest";
import { Company, WsMessage, SortByQuery } from "api/models";
import { getAxiosErrorMessage } from "utils/modelUtils";

import { Welcome } from "./components/welcome";

const toSortByQuery = (
  sortBy?: SortByQuery
): CompanySortByQuery | undefined => {
  if (!sortBy) {
    return undefined;
  }

  let field: CompanySortBy;
  switch (sortBy.index) {
    case 0:
      field = CompanySortBy.NAME;
      break;
    default:
      throw new Error("Invalid column index=" + sortBy.index);
  }

  return {
    field,
    direction: sortBy.direction,
  };
};

const COMPANY_FIELD = "company";

const getRow = (rowData: IRowData): Company => {
  return rowData[COMPANY_FIELD];
};

export interface CompanyListProps extends RouteComponentProps {}

export const CompanyList: React.FC<CompanyListProps> = ({ history }) => {
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();

  const [filterText, setFilterText] = useState("");

  const { deleteCompany } = useDeleteCompany();

  const {
    companies,
    isFetching,
    fetchError,
    fetchCount,
    fetchCompanies,
  } = useFetchCompanies(true);

  const {
    paginationQuery,
    sortByQuery,
    handlePaginationChange,
    handleSortChange,
  } = useTableControls();

  const refreshTable = useCallback(() => {
    fetchCompanies(
      {
        filterText,
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [filterText, paginationQuery, sortByQuery, fetchCompanies]);

  useEffect(() => {
    fetchCompanies(
      {
        filterText,
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [filterText, paginationQuery, sortByQuery, fetchCompanies]);

  const socketUrl = "ws://localhost:8080/companies";

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
            !(companies?.data || []).find((f) => f.id === event.spec.id)
          ) {
            refreshTable();
          }
          break;
        case "DELETED":
          if (companies && companies.data.find((f) => f.id === event.spec.id)) {
            refreshTable();
          }
          break;
      }
    }
  }, [eventMsg, companies, paginationQuery, sortByQuery, refreshTable]);

  const columns: ICell[] = [
    { title: "Name", transforms: [sortable, cellWidth(40)] },
    { title: "Description" },
  ];

  const itemsToRow = (items: Company[]) => {
    return items.map((item) => ({
      [COMPANY_FIELD]: item,
      cells: [
        {
          title: (
            <Link to={formatPath(Paths.editCompany, { company: item.name })}>
              {item.name}
            </Link>
          ),
        },
        {
          title: item.description,
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
        const row: Company = getRow(rowData);
        history.push(formatPath(Paths.editCompany, { company: row.name }));
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
        const row: Company = getRow(rowData);
        dispatch(
          deleteWithMatchModalActions.openModal({
            title: "Delete company",
            message: `Are you sure you want to delete the company ${row.name}`,
            matchText: row.name,
            onDelete: () => {
              dispatch(deleteWithMatchModalActions.processing());
              deleteCompany(
                row,
                () => {
                  dispatch(deleteWithMatchModalActions.closeModal());
                  // refreshTable();
                },
                (error) => {
                  dispatch(deleteWithMatchModalActions.closeModal());
                  dispatch(
                    alertActions.addErrorAlert(getAxiosErrorMessage(error))
                  );
                }
              );
            },
          })
        );
      },
    },
  ];

  const handleOnNewCompany = () => {
    history.push(Paths.newCompany);
  };

  const handleOnFilterApplied = (filterText: string) => {
    setFilterText(filterText);
    handlePaginationChange({ page: 1 });
  };

  if (fetchCount === 1 && companies?.data.length === 0) {
    return (
      <Bullseye>
        <Welcome onPrimaryAction={handleOnNewCompany} />
      </Bullseye>
    );
  }

  return (
    <>
      <ConditionalRender
        when={isFetching && !(companies || fetchError)}
        then={<AppPlaceholder />}
      >
        <SimplePageSection
          title="Companies"
          description="Companies allow you to group your documents."
        />
        <PageSection>
          <AppTableWithControls
            count={companies ? companies.meta.count : 0}
            items={companies ? companies.data : []}
            itemsToRow={itemsToRow}
            pagination={paginationQuery}
            sortBy={sortByQuery}
            handlePaginationChange={handlePaginationChange}
            handleSortChange={handleSortChange}
            columns={columns}
            actions={actions}
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
              <>
                <ToolbarGroup variant="button-group">
                  <ToolbarItem>
                    <Button
                      type="button"
                      aria-label="new-company"
                      variant={ButtonVariant.primary}
                      onClick={handleOnNewCompany}
                    >
                      New company
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </>
            }
            noDataState={
              <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateIcon icon={AddCircleOIcon} />
                <Title headingLevel="h2" size="lg">
                  No companies available
                </Title>
                <EmptyStateBody>
                  Add a company by clicking on <strong>New company</strong>.
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
