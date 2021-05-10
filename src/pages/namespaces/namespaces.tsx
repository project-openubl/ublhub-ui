import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import { AppPlaceholder } from "shared/components";
import { Paths } from "Paths";

const NamespaceList = lazy(() => import("./namespace-list"));

export const Namespaces: React.FC = () => {
  return (
    <>
      <Suspense fallback={<AppPlaceholder />}>
        <Switch>
          <Route path={Paths.namespaceList} component={NamespaceList} exact />
        </Switch>
      </Suspense>
    </>
  );
};
