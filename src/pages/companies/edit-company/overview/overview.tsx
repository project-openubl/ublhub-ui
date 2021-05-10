import React, { useCallback, useEffect } from "react";
import { RouteComponentProps, useParams } from "react-router-dom";

import { Card, CardBody, Grid, GridItem } from "@patternfly/react-core";

import { CompanyRoute, NamespaceRoute } from "Paths";
import { getCompany } from "api/rest";
import { Company } from "api/models";

import {
  AppPlaceholder,
  ConditionalRender,
  ErrorEmptyState,
} from "shared/components";
import { useFetch } from "shared/hooks";

import { CompanyDetails } from "./components/company-details";
import { CompanySunatDetails } from "./components/company-sunat-details";

export interface OverviewProps extends RouteComponentProps<NamespaceRoute> {}

export const Overview: React.FC<OverviewProps> = ({ match: { params } }) => {
  const { namespaceId, companyId } = useParams<CompanyRoute>();

  const fetchCompany = useCallback(() => {
    return getCompany(namespaceId, companyId);
  }, [namespaceId, companyId]);

  const {
    data: company,
    isFetching: isFetchingCompany,
    fetchError: fetchErrorCompany,
    requestFetch: refreshCompany,
  } = useFetch<Company>({
    defaultIsFetching: true,
    onFetch: fetchCompany,
  });

  useEffect(() => {
    refreshCompany();
  }, [refreshCompany]);

  if (fetchErrorCompany) {
    return (
      <Card>
        <CardBody>
          <ErrorEmptyState error={fetchErrorCompany} />
        </CardBody>
      </Card>
    );
  }

  return (
    <ConditionalRender when={isFetchingCompany} then={<AppPlaceholder />}>
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
