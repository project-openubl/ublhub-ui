import React, { useCallback, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

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
  cellWidth,
  IActions,
  ICell,
  IExtraData,
  IRow,
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
import { useTableControls, useDelete, useFetch } from "shared/hooks";
import { DeleteWithMatchModalContainer } from "shared/containers";

import { formatPath, NamespaceRoute, Paths } from "Paths";
import {
  CompanySortBy,
  CompanySortByQuery,
  deleteCompany,
  getCompanies,
} from "api/rest";
import { Company, SortByQuery, PageRepresentation } from "api/models";
import { getAxiosErrorMessage } from "utils/modelUtils";

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
      return undefined;
  }

  return {
    field,
    direction: sortBy.direction,
  };
};

const ROW_VALUE = "rowValue";

const getRow = (rowData: IRowData): Company => {
  return rowData[ROW_VALUE];
};

export const CompanyList: React.FC = () => {
  const history = useHistory();
  const { namespaceId } = useParams<NamespaceRoute>();

  const dispatch = useDispatch();

  const [filterText, setFilterText] = useState("");

  const { requestDelete: requestDeleteCompany } = useDelete({
    onDelete: (ns: Company) => deleteCompany(namespaceId, ns.id!),
  });

  const {
    paginationQuery,
    sortByQuery,
    handlePaginationChange,
    handleSortChange,
  } = useTableControls();

  const fetchCompanies = useCallback(() => {
    return getCompanies(
      namespaceId,
      {
        filterText: filterText,
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [filterText, namespaceId, paginationQuery, sortByQuery]);

  const {
    data: companies,
    isFetching: isFetchingCompanies,
    fetchError: fetchErrorCompanies,
    requestFetch: refreshCompanyTable,
  } = useFetch<PageRepresentation<Company>>({
    defaultIsFetching: true,
    onFetch: fetchCompanies,
  });

  useEffect(() => {
    refreshCompanyTable();
  }, [filterText, paginationQuery, sortByQuery, refreshCompanyTable]);

  // Table

  const columns: ICell[] = [
    { title: "RUC", transforms: [sortable, cellWidth(20)] },
    { title: "Nombre", transforms: [sortable, cellWidth(30)] },
    { title: "Descripción", transforms: [sortable, cellWidth(45)] },
  ];

  const rows: IRow[] = [];
  companies?.data.forEach((item) => {
    rows.push({
      [ROW_VALUE]: item,
      cells: [
        {
          title: (
            <Link
              to={formatPath(Paths.editCompany, {
                namespaceId,
                companyId: item.id,
              })}
            >
              {item.ruc}
            </Link>
          ),
        },
        {
          title: item.name,
        },
        {
          title: item.description,
        },
      ],
    });
  });

  const actions: IActions = [
    {
      title: "Editar",
      onClick: (
        event: React.MouseEvent,
        rowIndex: number,
        rowData: IRowData,
        extraData: IExtraData
      ) => {
        const row: Company = getRow(rowData);
        history.push(
          formatPath(Paths.editCompany, { namespaceId, companyId: row.id })
        );
      },
    },
    {
      title: "Eliminar",
      onClick: (
        event: React.MouseEvent,
        rowIndex: number,
        rowData: IRowData,
        extraData: IExtraData
      ) => {
        const row: Company = getRow(rowData);
        dispatch(
          deleteWithMatchModalActions.openModal({
            title: "Eliminar empresa",
            message: `¿Estás seguro de querer eliminar la empresa RUC=${row.ruc} (${row.name})?`,
            matchText: row.ruc,
            onDelete: () => {
              dispatch(deleteWithMatchModalActions.processing());
              requestDeleteCompany(
                row,
                () => {
                  dispatch(deleteWithMatchModalActions.closeModal());
                  refreshCompanyTable();
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

  const redirectToNewCompanyPage = () => {
    history.push(formatPath(Paths.newCompany, { namespaceId }));
  };

  const applyFilterText = (filterText: string) => {
    setFilterText(filterText);
    handlePaginationChange({ page: 1 });
  };

  return (
    <>
      <ConditionalRender
        when={isFetchingCompanies && !(companies || fetchErrorCompanies)}
        then={<AppPlaceholder />}
      >
        <SimplePageSection
          title="Empresas"
          description="Registra tus empresas."
        />
        <PageSection>
          <AppTableWithControls
            count={companies ? companies.meta.count : 0}
            pagination={paginationQuery}
            sortBy={sortByQuery}
            onPaginationChange={handlePaginationChange}
            onSort={handleSortChange}
            cells={columns}
            rows={rows}
            actions={actions}
            isLoading={isFetchingCompanies}
            loadingVariant="none"
            fetchError={fetchErrorCompanies}
            filtersApplied={filterText.trim().length > 0}
            toolbar={
              <>
                <ToolbarGroup variant="filter-group">
                  <SearchFilter onApplyFilter={applyFilterText} />
                </ToolbarGroup>
                <ToolbarGroup variant="button-group">
                  <ToolbarItem>
                    <Button
                      type="button"
                      aria-label="new-company"
                      variant={ButtonVariant.primary}
                      onClick={redirectToNewCompanyPage}
                    >
                      Crear empresa
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </>
            }
            noDataState={
              <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateIcon icon={AddCircleOIcon} />
                <Title headingLevel="h2" size="lg">
                  No existen empresas
                </Title>
                <EmptyStateBody>
                  Crea una empresa haciendo click en{" "}
                  <strong>Crear empresa</strong>.
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
