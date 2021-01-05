import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

import { Grid, GridItem } from "@patternfly/react-core";

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
    return <ErrorEmptyState error={fetchError} />;
  }

  return (
    <ConditionalRender when={isFetching} then={<AppPlaceholder />}>
      {company && (
        <Grid hasGutter>
          <GridItem md={4}>
            <CompanyDetails company={company} />
          </GridItem>
          <GridItem md={8}>
            <CompanySunatDetails company={company} />
          </GridItem>
        </Grid>
      )}
    </ConditionalRender>
  );
};
