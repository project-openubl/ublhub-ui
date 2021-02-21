import React, { lazy, Suspense } from "react";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";

import { PageSection } from "@patternfly/react-core";

import { AppPlaceholder } from "shared/components";
import { DeleteWithMatchModalContainer } from "shared/containers";

import { CompanytRoute, Paths } from "Paths";

import { EditCompanyHeader } from "./edit-company-header";

const Overview = lazy(() => import("./overview"));
const Details = lazy(() => import("./details"));
const SunatCredentials = lazy(() => import("./sunat-credentials"));

export interface AnalysisConfigurationProps
  extends RouteComponentProps<CompanytRoute> {}

export const EditCompany: React.FC<AnalysisConfigurationProps> = () => {
  return (
    <>
      <EditCompanyHeader />
      <PageSection>
        <Suspense fallback={<AppPlaceholder />}>
          <Switch>
            <Route path={Paths.editCompany_overview} component={Overview} />
            <Route path={Paths.editCompany_details} component={Details} />
            <Route
              path={Paths.editCompany_sunatCredentials}
              component={SunatCredentials}
            />
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
