import React, { useCallback, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

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
  IExtraData,
  IRowData,
  ISortBy,
  sortable,
} from "@patternfly/react-table";
import { AddCircleOIcon } from "@patternfly/react-icons";

import {
  AppPlaceholder,
  AppTableWithControls,
  ConditionalRender,
  SimplePageSection,
} from "shared/components";
import { useTableControls } from "shared/hooks";

import { formatPath, Paths } from "Paths";
import { Company } from "api/models";

import { Welcome } from "./components/welcome";
import useFetchCompany from "./hooks/useFetchCompany";

const columns: ICell[] = [
  { title: "Name", transforms: [sortable] },
  { title: "Description" },
];

const COMPANY_FIELD = "company";

const getRow = (rowData: IRowData): Company => {
  return rowData[COMPANY_FIELD];
};

const itemsToRow = (items: Company[]) => {
  return items.map((item) => ({
    [COMPANY_FIELD]: item,
    cells: [
      {
        title: item.name,
      },
      {
        title: item.description,
      },
    ],
  }));
};

export interface CompanyListProps extends RouteComponentProps {}

export const CompanyList: React.FC<CompanyListProps> = ({ history }) => {
  const {
    companies,
    isFetching,
    fetchError,
    fetchCount,
    fetchCompanies,
  } = useFetchCompany(true);

  const {
    filterText,
    pagination,
    sortBy,
    handleFilterTextChange,
    handlePaginationChange,
    handleSortChange,
  } = useTableControls();

  const reloadTable = useCallback(
    (
      filterText: string,
      pagination: { page: number; perPage: number },
      sortBy?: ISortBy
    ) => {
      //sortBy.
      fetchCompanies(pagination, undefined, filterText);
    },
    [fetchCompanies]
  );

  useEffect(() => {
    reloadTable(filterText, pagination, sortBy);
  }, [filterText, pagination, sortBy, reloadTable]);

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
        history.push(formatPath(Paths.editCompany, { company: row.id }));
      },
    },
  ];

  const newCompany = () => {
    history.push(Paths.newCompany);
  };

  if (fetchCount === 1 && companies?.data.length === 0) {
    return (
      <Bullseye>
        <Welcome onPrimaryAction={newCompany} />
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
            pagination={pagination}
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
                    variant={ButtonVariant.primary}
                    onClick={newCompany}
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
    </>
  );
};
