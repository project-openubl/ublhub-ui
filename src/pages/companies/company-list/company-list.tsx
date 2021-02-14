import React, { useCallback, useEffect } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { useDispatch } from "react-redux";

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
  IActions,
  ICell,
  IExtraColumnData,
  IExtraData,
  IRowData,
  sortable,
  SortByDirection,
} from "@patternfly/react-table";
import { AddCircleOIcon } from "@patternfly/react-icons";

import { alertActions } from "store/alert";
import { deleteWithMatchModalActions } from "store/delete-with-match-modal";

import {
  AppPlaceholder,
  AppTableWithControls,
  ConditionalRender,
  SimplePageSection,
} from "shared/components";
import {
  useTableControls,
  useFetchCompanies,
  useDeleteCompany,
} from "shared/hooks";
import { DeleteWithMatchModalContainer } from "shared/containers";

import { formatPath, Paths } from "Paths";
import { Company, PageQuery, SortByQuery } from "api/models";
import { getAxiosErrorMessage } from "utils/modelUtils";

import { Welcome } from "./components/welcome";

const columns: ICell[] = [
  { title: "Name", transforms: [sortable] },
  { title: "Description" },
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

const COMPANY_FIELD = "company";

const getRow = (rowData: IRowData): Company => {
  return rowData[COMPANY_FIELD];
};

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

export interface CompanyListProps extends RouteComponentProps {}

export const CompanyList: React.FC<CompanyListProps> = ({ history }) => {
  const dispatch = useDispatch();

  const { deleteCompany } = useDeleteCompany();

  const {
    companies,
    isFetching,
    fetchError,
    fetchCount,
    fetchCompanies,
  } = useFetchCompanies(true);

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
      fetchCompanies(pagination, sortBy, filterText);
    },
    [fetchCompanies]
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
                  reloadTable(filterText, paginationQuery, sortByQuery);
                },
                (error) => {
                  dispatch(deleteWithMatchModalActions.closeModal());
                  dispatch(
                    alertActions.addAlert(
                      "danger",
                      "Error",
                      getAxiosErrorMessage(error)
                    )
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
                    aria-label="new-company"
                    variant={ButtonVariant.primary}
                    onClick={handleOnNewCompany}
                  >
                    New company
                  </Button>
                </ToolbarItem>
              </ToolbarGroup>
            }
            filtersApplied={filterText.trim().length > 0}
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
