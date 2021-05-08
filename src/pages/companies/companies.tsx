import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import {
  AppPlaceholder,
  NamespaceContextSelectorSection,
} from "shared/components";
import { Paths } from "Paths";

import { NamespaceContextSelector } from "shared/containers";

const CommpanyList = lazy(() => import("./company-list"));
const NewCompany = lazy(() => import("./new-company"));
const EditCompany = lazy(() => import("./edit-company"));

export const Projects: React.FC = () => {
  return (
    <>
      <NamespaceContextSelectorSection>
        <NamespaceContextSelector url={Paths.companyList} />
      </NamespaceContextSelectorSection>
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
