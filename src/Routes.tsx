import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { Paths } from "./Paths";

const Companies = lazy(() => import("./pages/companies"));

export const AppRoutes = () => {
  const routes = [
    { component: Companies, path: Paths.companies, exact: false },
  ];

  return (
    <Suspense fallback={<p>loading...</p>}>
      <Switch>
        {routes.map(({ path, component, ...rest }, index) => (
          <Route key={index} path={path} component={component} {...rest} />
        ))}
        <Redirect from={Paths.base} to={Paths.companies} exact />
      </Switch>
    </Suspense>
  );
};
