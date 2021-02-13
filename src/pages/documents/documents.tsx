import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import { AppPlaceholder } from "shared/components";
import { Paths } from "Paths";

const SelectCompany = lazy(() => import("./select-company"));
const DocumentList = lazy(() => import("./document-list"));
const NewDocument = lazy(() => import("./new-document"));

export const Documents: React.FC = () => {
  return (
    <Suspense fallback={<AppPlaceholder />}>
      <Switch>
        <Route path={Paths.documents_selectCompany} component={SelectCompany} />
        <Route
          path={Paths.documents_byCompany}
          component={DocumentList}
          exact
        />
        <Route path={Paths.documents_byCompany_new} component={NewDocument} />
      </Switch>
    </Suspense>
  );
};
