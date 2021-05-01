import React from "react";

import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
  ToolbarToggleGroup,
} from "@patternfly/react-core";
import {
  IActions,
  IActionsResolver,
  IAreActionsDisabled,
  ICell,
  IExtraColumnData,
  IRow,
  ISortBy,
  OnCollapse,
  OnExpand,
  SortByDirection,
} from "@patternfly/react-table";
import { FilterIcon } from "@patternfly/react-icons";

import { AppTable } from "../app-table/app-table";
import { SimplePagination } from "../simple-pagination";

export interface AppTableWithControlsProps {
  count: number;

  pagination: {
    perPage?: number;
    page?: number;
  };
  sortBy?: ISortBy;
  handlePaginationChange: ({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }) => void;
  handleSortChange: (
    event: React.MouseEvent,
    index: number,
    direction: SortByDirection,
    extraData: IExtraColumnData
  ) => void;

  onCollapse?: OnCollapse;
  onExpand?: OnExpand;

  rows: IRow[];
  columns: ICell[];
  actions?: IActions;
  actionResolver?: IActionsResolver;
  areActionsDisabled?: IAreActionsDisabled;

  isLoading: boolean;
  loadingVariant?: "skeleton" | "spinner" | "none";
  fetchError?: any;

  toolbar?: any;
  toolbarToggle?: any;
  clearAllFilters?: () => void;

  filtersApplied: boolean;
  noDataState?: any;
  noSearchResultsState?: any;
  errorState?: any;
}

export const AppTableWithControls: React.FC<AppTableWithControlsProps> = ({
  count,

  pagination,
  sortBy,
  handlePaginationChange,
  handleSortChange,

  onCollapse,
  onExpand,

  rows,
  columns,
  actions,
  actionResolver,
  areActionsDisabled,

  isLoading,
  fetchError,
  loadingVariant,

  toolbar,
  toolbarToggle,
  clearAllFilters,

  filtersApplied,
  noDataState,
  noSearchResultsState,
  errorState,
}) => {
  return (
    <div style={{ backgroundColor: "var(--pf-global--BackgroundColor--100)" }}>
      <Toolbar
        className="pf-m-toggle-group-container"
        collapseListedFiltersBreakpoint="xl"
        clearAllFilters={clearAllFilters}
      >
        <ToolbarContent>
          {toolbarToggle && (
            <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
              {toolbarToggle}
            </ToolbarToggleGroup>
          )}
          {toolbar}
          <ToolbarItem
            variant={ToolbarItemVariant.pagination}
            alignment={{ default: "alignRight" }}
          >
            <SimplePagination
              count={count}
              params={pagination}
              onChange={handlePaginationChange}
              isTop={true}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <AppTable
        columns={columns}
        rows={rows}
        actions={actions}
        actionResolver={actionResolver}
        areActionsDisabled={areActionsDisabled}
        isLoading={isLoading}
        fetchError={fetchError}
        loadingVariant={loadingVariant}
        sortBy={sortBy}
        onSort={handleSortChange}
        onCollapse={onCollapse}
        onExpand={onExpand}
        filtersApplied={filtersApplied}
        noDataState={noDataState}
        noSearchResultsState={noSearchResultsState}
        errorState={errorState}
      />
      <SimplePagination
        count={count}
        params={pagination}
        onChange={handlePaginationChange}
      />
    </div>
  );
};
