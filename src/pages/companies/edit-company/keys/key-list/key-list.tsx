import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { AxiosResponse } from "axios";
import { useSelectionState } from "@konveyor/lib-ui";

import {
  ButtonVariant,
  ClipboardCopy,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  cellWidth,
  expandable,
  IActions,
  ICell,
  IExtraData,
  IRow,
  IRowData,
  TableText,
} from "@patternfly/react-table";

import { useDispatch } from "react-redux";
import { confirmDialogActions } from "store/confirmDialog";

import {
  useDelete,
  useFetch,
  useTableControls,
  useTableFilter,
} from "shared/hooks";
import { AppTableWithControls } from "shared/components";

import { CompanyRoute, formatPath, Paths } from "Paths";
import {
  ComponentRepresentation,
  KeyMetadataRepresentation,
  KeysMetadataRepresentation,
} from "api/models";
import {
  deleteCompanyComponent,
  getCompanyComponents,
  getCompanyKeys,
} from "api/rest";
import { alertActions } from "store/alert";
import { getAxiosErrorMessage } from "utils/modelUtils";
import { DEFAULT_KEY_ALGORITHM } from "Constants";

const ENTITY_FIELD = "entity";

const getRow = (rowData: IRowData): ComponentRepresentation => {
  return rowData[ENTITY_FIELD];
};

export const KeyList: React.FC = () => {
  //Router
  const { namespaceId, companyId } = useParams<CompanyRoute>();
  const history = useHistory();

  // Redux
  const dispatch = useDispatch();

  // Filters
  const [filterText, setFilterText] = useState("");

  const { requestDelete: deleteComponent } = useDelete<ComponentRepresentation>(
    { onDelete: (c) => deleteCompanyComponent(namespaceId, companyId, c.id) }
  );

  // Required data
  const [componentsMap, setComponentsMap] =
    useState<Map<string, ComponentRepresentation>>();
  const [keyMetadataMap, setKeyMetadataMap] =
    useState<Map<string, KeyMetadataRepresentation>>();
  const [activeKeyMap, setActiveKeyMap] = useState<Map<string, string>>();

  // Table data
  const fetchCompany = useCallback(() => {
    return Promise.all([
      getCompanyKeys(namespaceId, companyId),
      getCompanyComponents(namespaceId, companyId),
    ]);
  }, [namespaceId, companyId]);

  const {
    data: keysRequiredData,
    isFetching: isFetchingRequiredData,
    fetchError: fetchErrorRequiredData,
    requestFetch: refreshKeysRequiredData,
  } = useFetch<
    [
      AxiosResponse<KeysMetadataRepresentation>,
      AxiosResponse<ComponentRepresentation[]>
    ]
  >({
    defaultIsFetching: true,
    onFetchPromise: fetchCompany,
  });

  const componentsMapValues = useMemo(() => {
    return componentsMap ? Array.from(componentsMap.values()) : [];
  }, [componentsMap]);

  useEffect(() => {
    refreshKeysRequiredData();
  }, [refreshKeysRequiredData]);

  useEffect(() => {
    if (keysRequiredData) {
      const [{ data: keysData }, { data: componentsData }] = keysRequiredData;

      // Save components
      const newComponents: Map<string, ComponentRepresentation> = new Map();
      componentsData.forEach((c) => newComponents.set(c.id, c));
      setComponentsMap(newComponents);

      // Save keys metadata
      const newKeysMedatadata: Map<string, KeyMetadataRepresentation> =
        new Map();
      keysData.keys.forEach((e) => newKeysMedatadata.set(e.providerId, e));
      setKeyMetadataMap(newKeysMedatadata);

      // Save active keys
      const newActiveKeys: Map<string, string> = new Map();
      for (const k in keysData.active) {
        if (keysData.active[k]) {
          const kid = keysData.active[k];
          const key = keysData.keys.find((e) => e.kid === kid);
          newActiveKeys.set(k, key!.providerId);
        }
      }
      setActiveKeyMap(newActiveKeys);
    }
  }, [keysRequiredData]);

  // Table behaviour
  const {
    paginationQuery: pagination,
    sortByQuery: sortBy,
    handlePaginationChange: onPaginationChange,
    handleSortChange: onSort,
  } = useTableControls({
    paginationQuery: { page: 1, perPage: 10 },
  });

  const {
    isItemSelected: isItemExpanded,
    toggleItemSelected: toggleItemExpanded,
  } = useSelectionState<ComponentRepresentation>({
    items: componentsMapValues,
    isEqual: (a, b) => a.id === b.id,
  });

  const { pageItems } = useTableFilter<ComponentRepresentation>({
    items: componentsMapValues,
    sortBy,
    compareToByColumn: () => 1,
    pagination,
    filterItem: (item) => {
      return item.name.toLowerCase().startsWith(filterText.toLowerCase());
    },
  });

  // Table
  const columns: ICell[] = [
    {
      title: "Nombre",
      transforms: [cellWidth(15)],
      cellFormatters: [expandable],
    },
    {
      title: "Proveedor",
      transforms: [cellWidth(10)],
      cellFormatters: [],
    },
    {
      title: "Algoritmo",
      transforms: [cellWidth(10)],
      cellFormatters: [],
    },
    {
      title: "Tipo",
      transforms: [cellWidth(10)],
      cellFormatters: [],
    },
    {
      title: "Kid",
      transforms: [cellWidth(30)],
      cellFormatters: [],
    },
    {
      title: "Prioridad",
      transforms: [],
      cellFormatters: [],
    },
    {
      title: "Estado",
      transforms: [],
      cellFormatters: [],
    },
  ];

  const actions: IActions = [
    {
      title: "Editar",
      onClick: (
        event: React.MouseEvent,
        rowIndex: number,
        rowData: IRowData
      ) => {
        const row = getRow(rowData);
        history.push(
          formatPath(Paths.editCompany_keys_edit, {
            namespaceId,
            companyId,
            componentId: row.id,
            providerId: row.providerId,
          })
        );
      },
    },
    {
      title: "Eliminar",
      onClick: (
        event: React.MouseEvent,
        rowIndex: number,
        rowData: IRowData
      ) => {
        const row = getRow(rowData);

        dispatch(
          confirmDialogActions.openDialog({
            title: "Eliminar certificado",
            titleIconVariant: "warning",
            message: "¿Estás seguro de querer eliminar este componente?",
            confirmBtnVariant: ButtonVariant.danger,
            confirmBtnLabel: "Eliminar",
            cancelBtnLabel: "Cancelar",
            onConfirm: () => {
              dispatch(confirmDialogActions.processing());
              deleteComponent(
                row,
                () => {
                  dispatch(confirmDialogActions.closeDialog());
                  refreshKeysRequiredData();
                },
                (error) => {
                  dispatch(confirmDialogActions.closeDialog());
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

  const rows: IRow[] = [];
  pageItems.forEach((item) => {
    const isExpanded = isItemExpanded(item);

    const isActive = activeKeyMap
      ? activeKeyMap.get(DEFAULT_KEY_ALGORITHM) === item.id
      : false;

    let statusNode;
    const status = keyMetadataMap?.get(item.id)?.status;
    if (status === "ACTIVE") {
      statusNode = <Label color="green">Active</Label>;
    } else if (status === "PASSIVE") {
      statusNode = <Label color="cyan">Passive</Label>;
    } else {
      statusNode = <Label color="orange">Disabled</Label>;
    }

    rows.push({
      [ENTITY_FIELD]: item,
      isOpen: isExpanded,
      favorited: isActive,
      cells: [
        {
          title: (
            <TableText wrapModifier="truncate">
              <Link
                to={formatPath(Paths.editCompany_keys_edit, {
                  namespaceId,
                  companyId,
                  componentId: item.id,
                  providerId: item.providerId,
                })}
              >
                {item.name}
              </Link>
            </TableText>
          ),
        },
        {
          title: (
            <TableText wrapModifier="truncate">{item.providerId}</TableText>
          ),
        },
        {
          title: (
            <TableText wrapModifier="truncate">
              {keyMetadataMap?.get(item.id)?.algorithm}
            </TableText>
          ),
        },
        {
          title: (
            <TableText wrapModifier="truncate">
              {keyMetadataMap?.get(item.id)?.type}
            </TableText>
          ),
        },
        {
          title: (
            <TableText wrapModifier="truncate">
              {keyMetadataMap?.get(item.id)?.kid}
            </TableText>
          ),
        },
        {
          title: (
            <TableText wrapModifier="truncate">
              {keyMetadataMap?.get(item.id)?.providerPriority}
            </TableText>
          ),
        },
        {
          title: statusNode,
        },
      ],
    });

    if (isExpanded) {
      rows.push({
        parent: rows.length - 1,
        fullWidth: false,
        cells: [
          <div className="pf-c-table__expandable-row-content">
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Public key</DescriptionListTerm>
                <DescriptionListDescription>
                  <ClipboardCopy>
                    {keyMetadataMap?.get(item.id)?.publicKey}
                  </ClipboardCopy>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Certificate</DescriptionListTerm>
                <DescriptionListDescription>
                  <ClipboardCopy>
                    {keyMetadataMap?.get(item.id)?.certificate}
                  </ClipboardCopy>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </div>,
        ],
      });
    }
  });

  // Row actions
  const collapseRow = (
    event: React.MouseEvent,
    rowIndex: number,
    isOpen: boolean,
    rowData: IRowData,
    extraData: IExtraData
  ) => {
    const row = getRow(rowData);
    toggleItemExpanded(row);
  };

  return (
    <>
      <AppTableWithControls
        count={componentsMap ? componentsMap.size : 0}
        pagination={pagination}
        sortBy={sortBy}
        onPaginationChange={onPaginationChange}
        onSort={onSort}
        cells={columns}
        rows={rows}
        actions={actions}
        onCollapse={collapseRow}
        onFavorite={() => {}}
        canSortFavorites={false}
        filtersApplied={false}
        isLoading={isFetchingRequiredData}
        loadingVariant="skeleton"
        fetchError={fetchErrorRequiredData}
        toolbar={
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem>
                <SearchInput
                  placeholder="Filter..."
                  value={filterText}
                  onChange={setFilterText}
                  onClear={() => setFilterText("")}
                />
              </ToolbarItem>
              <ToolbarGroup variant="button-group">
                <ToolbarItem>
                  <Link
                    className="pf-c-button pf-m-primary"
                    to={formatPath(Paths.editCompany_keys_new, {
                      namespaceId,
                      companyId,
                      providerId: "rsa",
                    })}
                  >
                    Importar RSA
                  </Link>
                </ToolbarItem>
                <ToolbarItem>
                  <Link
                    className="pf-c-button pf-m-secondary"
                    to={formatPath(Paths.editCompany_keys_new, {
                      namespaceId,
                      companyId,
                      providerId: "rsa-generated",
                    })}
                  >
                    Generar RSA
                  </Link>
                </ToolbarItem>
                <ToolbarItem>
                  <Link
                    className="pf-c-button pf-m-secondary"
                    to={formatPath(Paths.editCompany_keys_new, {
                      namespaceId,
                      companyId,
                      providerId: "java-keystore",
                    })}
                  >
                    Java Keystore
                  </Link>
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>
        }
      />
    </>
  );
};
