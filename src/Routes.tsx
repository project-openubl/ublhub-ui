import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { AppPlaceholder, SimplePageSection } from "shared/components";
import { Paths } from "./Paths";

const Namespaces = lazy(() => import("./pages/namespaces"));
const Companies = lazy(() => import("./pages/companies"));
const Documents = lazy(() => import("./pages/documents"));
const SelectNamespace = lazy(() => import("./pages/namespace-no-selected"));

export const AppRoutes = () => {
  const routes = [
    { component: Namespaces, path: Paths.namespaceList, exact: false },
    { component: Companies, path: Paths.companyList, exact: false },
    { component: Documents, path: Paths.documentList, exact: false },

    {
      render: () => (
        <SelectNamespace
          path={Paths.companyList}
          titlePageSection={<SimplePageSection title="Empresas" />}
        />
      ),
      path: Paths.companyList_empty,
      exact: false,
    },
    {
      render: () => (
        <SelectNamespace
          path={Paths.documentList}
          titlePageSection={<SimplePageSection title="Documentos" />}
        />
      ),
      path: Paths.documentList_empty,
      exact: false,
    },
  ];

  return (
    <Suspense fallback={<AppPlaceholder />}>
      <Switch>
        {routes.map(({ path, component, ...rest }, index) => (
          <Route key={index} path={path} component={component} {...rest} />
        ))}
        <Redirect from={Paths.base} to={Paths.namespaceList} exact />
      </Switch>
    </Suspense>
  );
};
