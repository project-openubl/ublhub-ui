import React from "react";
import { NavLink } from "react-router-dom";
import { Nav, NavItem, PageSidebar, NavList } from "@patternfly/react-core";

import { useSelector } from "react-redux";
import { RootState } from "store/rootReducer";
import { companyContextSelectors } from "store/company-context";

import { formatPath, Paths } from "Paths";
import { LayoutTheme } from "../LayoutUtils";

export const SidebarApp: React.FC = () => {
  const currentCompany = useSelector((state: RootState) =>
    companyContextSelectors.currentCompany(state)
  );

  const documentsLink = currentCompany
    ? formatPath(Paths.documentList, {
        company: currentCompany,
      })
    : Paths.documentList_empty;

  const renderPageNav = () => {
    return (
      <Nav id="nav-primary-simple" aria-label="Nav" theme={LayoutTheme}>
        <NavList>
          <NavItem>
            <NavLink to={Paths.namespaceList} activeClassName="pf-m-current">
              Namespaces
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to={Paths.companyList} activeClassName="pf-m-current">
              Companies
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to={documentsLink} activeClassName="pf-m-current">
              Documents
            </NavLink>
          </NavItem>
        </NavList>
      </Nav>
    );
  };

  return <PageSidebar nav={renderPageNav()} theme={LayoutTheme} />;
};
