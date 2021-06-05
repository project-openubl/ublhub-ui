import React from "react";

import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
} from "@patternfly/react-core";

import { AppTable, IAppTableProps } from "../app-table/app-table";
import { SimplePagination } from "../simple-pagination";

export interface IAppTableWithControlsProps extends IAppTableProps {
  count: number;
  pagination: {
    perPage?: number;
    page?: number;
  };
  onPaginationChange: ({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }) => void;

  toolbar?: any;
  toolbarClearAllFilters?: () => void;
}

export const AppTableWithControls: React.FC<IAppTableWithControlsProps> = ({
  count,
  pagination,
  onPaginationChange,

  toolbar,
  toolbarClearAllFilters,

  ...rest
}) => {
  return (
    <div style={{ backgroundColor: "var(--pf-global--BackgroundColor--100)" }}>
      <Toolbar
        className="pf-m-toggle-group-container"
        collapseListedFiltersBreakpoint="xl"
        clearAllFilters={toolbarClearAllFilters}
      >
        <ToolbarContent>
          {toolbar}
          <ToolbarItem
            variant={ToolbarItemVariant.pagination}
            alignment={{ default: "alignRight" }}
          >
            <SimplePagination
              count={count}
              params={pagination}
              onChange={onPaginationChange}
              isTop={true}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <AppTable {...rest} />
      <SimplePagination
        count={count}
        params={pagination}
        onChange={onPaginationChange}
      />
    </div>
  );
};
