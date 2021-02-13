import React from "react";
import { NavLink } from "react-router-dom";
import { Nav, NavItem, PageSidebar, NavGroup } from "@patternfly/react-core";

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
    ? formatPath(Paths.documents_byCompany, {
        company: currentCompany,
      })
    : Paths.documents_selectCompany;

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
            <NavLink to={documentsLink} activeClassName="pf-m-current">
              Documents
            </NavLink>
          </NavItem>
        </NavGroup>
      </Nav>
    );
  };

  return <PageSidebar nav={renderPageNav()} theme={LayoutTheme} />;
};
