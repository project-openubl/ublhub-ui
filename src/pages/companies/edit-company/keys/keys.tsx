import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router";
import { AppPlaceholder } from "shared/components";
import { Paths } from "Paths";

const KeyList = lazy(() => import("./key-list"));
const KeyCreateUpdate = lazy(() => import("./key-create-update"));

export const Keys: React.FC = () => {
  return (
    <>
      <Suspense fallback={<AppPlaceholder />}>
        <Switch>
          <Route path={Paths.editCompany_keys} component={KeyList} exact />
          <Route
            path={Paths.editCompany_keys_new}
            component={KeyCreateUpdate}
            exact
          />
          <Route
            path={Paths.editCompany_keys_edit}
            component={KeyCreateUpdate}
            exact
          />
        </Switch>
      </Suspense>
    </>
  );
};
