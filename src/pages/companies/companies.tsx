import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import { AppPlaceholder } from "components";
import { Paths } from "Paths";

const CommpanyList = lazy(() => import("./company-list"));
const NewCompany = lazy(() => import("./new-company"));

export const Projects: React.FC = () => {
  return (
    <>
      <Suspense fallback={<AppPlaceholder />}>
        <Switch>
          <Route path={Paths.companies} component={CommpanyList} exact />
          <Route path={Paths.newCompany} component={NewCompany} />
        </Switch>
      </Suspense>
    </>
  );
};
