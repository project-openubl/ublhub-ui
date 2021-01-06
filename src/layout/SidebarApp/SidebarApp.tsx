import React from "react";
import { NavLink } from "react-router-dom";
import { Nav, NavItem, PageSidebar, NavGroup } from "@patternfly/react-core";
import { LayoutTheme } from "../LayoutUtils";

import { Paths } from "Paths";

export const SidebarApp: React.FC = () => {
  const renderPageNav = () => {
    return (
      <Nav id="nav-primary-simple" aria-label="Nav" theme={LayoutTheme}>
        <NavGroup title="Global">
          <NavItem>
            <NavLink to={Paths.companyList} activeClassName="pf-m-current">
              Companies
            </NavLink>
          </NavItem>
        </NavGroup>
        <NavGroup title="Company">
          <NavItem>
            <NavLink to={Paths.documentList} activeClassName="pf-m-current">
              Documents
            </NavLink>
          </NavItem>
        </NavGroup>
      </Nav>
    );
  };

  return <PageSidebar nav={renderPageNav()} theme={LayoutTheme} />;
};
