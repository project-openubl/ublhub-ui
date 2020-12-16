import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import { AppPlaceholder } from "shared/components";
import { Paths } from "Paths";

const CommpanyList = lazy(() => import("./company-list"));
const NewCompany = lazy(() => import("./new-company"));
const EditCompany = lazy(() => import("./edit-company"));

export const Projects: React.FC = () => {
  return (
    <>
      <Suspense fallback={<AppPlaceholder />}>
        <Switch>
          <Route path={Paths.companyList} component={CommpanyList} exact />
          <Route path={Paths.newCompany} component={NewCompany} />
          <Route path={Paths.editCompany} component={EditCompany} />
        </Switch>
      </Suspense>
    </>
  );
};
