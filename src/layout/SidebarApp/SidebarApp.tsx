import React from "react";
import { NavLink } from "react-router-dom";
import { Nav, NavItem, PageSidebar, NavList } from "@patternfly/react-core";

import { useSelector } from "react-redux";
import { RootState } from "store/rootReducer";
import { namespaceContextSelectors } from "store/namespace-context";

import { formatPath, Paths } from "Paths";
import { LayoutTheme } from "../LayoutUtils";

export const SidebarApp: React.FC = () => {
  const currentNamespace = useSelector((state: RootState) =>
    namespaceContextSelectors.currentNamespace(state)
  );

  const nsRouteParam = {
    namespaceId: currentNamespace?.id,
  };

  const companiesLink = currentNamespace
    ? formatPath(Paths.companyList, nsRouteParam)
    : Paths.companyList_empty;
  const documentsLink = currentNamespace
    ? formatPath(Paths.documentList, nsRouteParam)
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
            <NavLink to={companiesLink} activeClassName="pf-m-current">
              Empresas
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to={documentsLink} activeClassName="pf-m-current">
              Documentos
            </NavLink>
          </NavItem>
        </NavList>
      </Nav>
    );
  };

  return <PageSidebar nav={renderPageNav()} theme={LayoutTheme} />;
};
