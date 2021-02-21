import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

import { Card, CardBody, Grid, GridItem } from "@patternfly/react-core";

import { CompanytRoute } from "Paths";

import { useFetchCompany } from "shared/hooks";
import {
  AppPlaceholder,
  ConditionalRender,
  ErrorEmptyState,
} from "shared/components";

import { CompanyDetails } from "./components/company-details";
import { CompanySunatDetails } from "./components/company-sunat-details";

export interface OverviewProps extends RouteComponentProps<CompanytRoute> {}

export const Overview: React.FC<OverviewProps> = ({ match: { params } }) => {
  const { company, isFetching, fetchError, fetchCompany } = useFetchCompany();

  useEffect(() => {
    fetchCompany(params.company);
  }, [params, fetchCompany]);

  if (fetchError) {
    return (
      <Card>
        <CardBody>
          <ErrorEmptyState error={fetchError} />
        </CardBody>
      </Card>
    );
  }

  return (
    <ConditionalRender when={isFetching} then={<AppPlaceholder />}>
      {company && (
        <Grid hasGutter>
          <GridItem lg={4}>
            <CompanyDetails company={company} />
          </GridItem>
          <GridItem lg={8}>
            <CompanySunatDetails company={company} />
          </GridItem>
        </Grid>
      )}
    </ConditionalRender>
  );
};
