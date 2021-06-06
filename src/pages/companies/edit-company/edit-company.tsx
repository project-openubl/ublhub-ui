import React, { lazy, Suspense } from "react";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";

import { PageSection } from "@patternfly/react-core";

import { AppPlaceholder } from "shared/components";
import { DeleteWithMatchModalContainer } from "shared/containers";

import { NamespaceRoute, Paths } from "Paths";

import { EditCompanyHeader } from "./edit-company-header";

const Overview = lazy(() => import("./overview"));
const Details = lazy(() => import("./details"));
const Keys = lazy(() => import("./keys"));

export interface AnalysisConfigurationProps
  extends RouteComponentProps<NamespaceRoute> {}

export const EditCompany: React.FC<AnalysisConfigurationProps> = () => {
  return (
    <>
      <EditCompanyHeader />
      <PageSection>
        <Suspense fallback={<AppPlaceholder />}>
          <Switch>
            <Route path={Paths.editCompany_overview} component={Overview} />
            <Route path={Paths.editCompany_details} component={Details} />
            <Route path={Paths.editCompany_keys} component={Keys} />

            <Redirect
              from={Paths.editCompany}
              to={Paths.editCompany_overview}
              exact
            />
          </Switch>
        </Suspense>
      </PageSection>
      <DeleteWithMatchModalContainer />
    </>
  );
};
