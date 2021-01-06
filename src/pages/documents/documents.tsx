import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import { AppPlaceholder } from "shared/components";
import { Paths } from "Paths";

const DocumentList = lazy(() => import("./document-list"));
const NewDocument = lazy(() => import("./new-document"));

export const Documents: React.FC = () => {
  return (
    <>
      <Suspense fallback={<AppPlaceholder />}>
        <Switch>
          <Route path={Paths.documentList} component={DocumentList} exact />
          <Route path={Paths.newDocument} component={NewDocument} />
        </Switch>
      </Suspense>
    </>
  );
};
