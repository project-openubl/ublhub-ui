import React, { lazy, Suspense } from "react";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";

import { PageSection } from "@patternfly/react-core";

import { AppPlaceholder } from "shared/components";
import { DeleteWithMatchModalContainer } from "shared/containers";

import { CompanytRoute, Paths } from "Paths";

import { EditCompanyHeader } from "./edit-company-header";

const Overview = lazy(() => import("./overview"));
const Sunat = lazy(() => import("./sunat"));

export interface AnalysisConfigurationProps
  extends RouteComponentProps<CompanytRoute> {}

export const EditCompany: React.FC<AnalysisConfigurationProps> = ({
  match,
}) => {
  return (
    <>
      <PageSection variant="light">
        <EditCompanyHeader />
      </PageSection>
      <PageSection>
        <Suspense fallback={<AppPlaceholder />}>
          <Switch>
            <Route path={Paths.editCompany_overview} component={Overview} />
            <Route path={Paths.editCompany_sunat} component={Sunat} />
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
