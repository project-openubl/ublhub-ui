import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  Bullseye,
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Modal,
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
import { useTableControls, useDelete, useFetch, useModal } from "shared/hooks";
import { DeleteWithMatchModalContainer } from "shared/containers";

import {
  deleteNamespace,
  getNamespaces,
  NamespaceSortBy,
  NamespaceSortByQuery,
} from "api/rest";
import {
  Company,
  SortByQuery,
  Namespace,
  PageRepresentation,
} from "api/models";
import { getAxiosErrorMessage } from "utils/modelUtils";

import { Welcome } from "./components/welcome";
import { NamespaceForm } from "./components/namespace-form";
import { Link } from "react-router-dom";
import { formatPath, Paths } from "Paths";

const toSortByQuery = (
  sortBy?: SortByQuery
): NamespaceSortByQuery | undefined => {
  if (!sortBy) {
    return undefined;
  }

  let field: NamespaceSortBy;
  switch (sortBy.index) {
    case 0:
      field = NamespaceSortBy.name;
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

export interface INamespaceListProps {}

export const NamespaceList: React.FC<INamespaceListProps> = () => {
  const dispatch = useDispatch();

  const [filterText, setFilterText] = useState("");

  const {
    isOpen: isNamespaceModalOpen,
    value: namespaceInModal,
    create: openNamespaceModalForCreating,
    update: openNamespaceModalForUpdating,
    close: closeNamespaceModal,
  } = useModal<Namespace>();

  const { requestDelete: requestDeleteNamespace } = useDelete({
    onDelete: (ns: Namespace) => deleteNamespace(ns),
  });

  const {
    paginationQuery,
    sortByQuery,
    handlePaginationChange,
    handleSortChange,
  } = useTableControls();

  const fetchNamespaces = useCallback(() => {
    return getNamespaces(
      {
        filterText: filterText,
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [filterText, paginationQuery, sortByQuery]);

  const {
    data: namespaces,
    isFetching: isFetchingNamespaces,
    fetchError: fetchErrorNamespaces,
    fetchCount: fetchCountNamespaces,
    requestFetch: refreshNamespacesTable,
  } = useFetch<PageRepresentation<Namespace>>({
    defaultIsFetching: true,
    onFetch: fetchNamespaces,
  });

  useEffect(() => {
    refreshNamespacesTable();
  }, [filterText, paginationQuery, sortByQuery, refreshNamespacesTable]);

  // Table

  const columns: ICell[] = [
    { title: "Nombre", transforms: [sortable, cellWidth(45)] },
    { title: "Descripción", transforms: [cellWidth(50)] },
  ];

  const rows: IRow[] = [];
  namespaces?.data.forEach((item) => {
    rows.push({
      [ROW_VALUE]: item,
      cells: [
        {
          title: (
            <Link
              to={formatPath(Paths.companyList, {
                namespaceId: item.id,
              })}
            >
              {item.name}
            </Link>
          ),
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
        const row: Namespace = getRow(rowData);
        openNamespaceModalForUpdating(row);
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
            title: "Eliminar namespace",
            message: `¿Estás seguro de querer eliminar el namespace ${row.name}?`,
            matchText: row.name,
            onDelete: () => {
              dispatch(deleteWithMatchModalActions.processing());
              requestDeleteNamespace(
                row,
                () => {
                  dispatch(deleteWithMatchModalActions.closeModal());
                  refreshNamespacesTable();
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

  const applyFilterText = (filterText: string) => {
    setFilterText(filterText);
    handlePaginationChange({ page: 1 });
  };

  const namespaceModal = (
    <Modal
      title={!namespaceInModal ? "Crear namespace" : "Actualizar namespace"}
      variant="medium"
      isOpen={isNamespaceModalOpen}
      onClose={closeNamespaceModal}
    >
      <NamespaceForm
        namespace={namespaceInModal}
        onSaved={() => {
          closeNamespaceModal();
          refreshNamespacesTable();
        }}
        onCancel={closeNamespaceModal}
      />
    </Modal>
  );

  if (fetchCountNamespaces === 1 && namespaces?.data.length === 0) {
    return (
      <Bullseye>
        <Welcome onPrimaryAction={() => openNamespaceModalForCreating()} />
        {namespaceModal}
      </Bullseye>
    );
  }

  return (
    <>
      <ConditionalRender
        when={isFetchingNamespaces && !(namespaces || fetchErrorNamespaces)}
        then={<AppPlaceholder />}
      >
        <SimplePageSection
          title="Namespaces"
          description="Crea multiples empresas dentro de un namespace."
        />
        <PageSection>
          <AppTableWithControls
            count={namespaces ? namespaces.meta.count : 0}
            pagination={paginationQuery}
            sortBy={sortByQuery}
            onPaginationChange={handlePaginationChange}
            onSort={handleSortChange}
            cells={columns}
            rows={rows}
            actions={actions}
            isLoading={isFetchingNamespaces}
            loadingVariant="skeleton"
            fetchError={fetchErrorNamespaces}
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
                      aria-label="new-namespace"
                      variant={ButtonVariant.primary}
                      onClick={openNamespaceModalForCreating}
                    >
                      Crear namespace
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </>
            }
            noDataState={
              <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateIcon icon={AddCircleOIcon} />
                <Title headingLevel="h2" size="lg">
                  No existen namespaces
                </Title>
                <EmptyStateBody>
                  Crea un namespace haciendo click en{" "}
                  <strong>Crear namespace</strong>.
                </EmptyStateBody>
              </EmptyState>
            }
          />
        </PageSection>
      </ConditionalRender>
      <DeleteWithMatchModalContainer />
      {namespaceModal}
    </>
  );
};
