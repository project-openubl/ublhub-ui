import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { AppPlaceholder } from "shared/components";
import { Paths } from "./Paths";

const Companies = lazy(() => import("./pages/companies"));
const Documents = lazy(() => import("./pages/documents"));

export const AppRoutes = () => {
  const routes = [
    { component: Companies, path: Paths.companyList, exact: false },
    { component: Documents, path: Paths.documentList, exact: false },
  ];

  return (
    <Suspense fallback={<AppPlaceholder />}>
      <Switch>
        {routes.map(({ path, component, ...rest }, index) => (
          <Route key={index} path={path} component={component} {...rest} />
        ))}
        <Redirect from={Paths.base} to={Paths.companyList} exact />
      </Switch>
    </Suspense>
  );
};
