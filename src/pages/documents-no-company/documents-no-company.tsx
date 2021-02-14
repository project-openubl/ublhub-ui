import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  PageSection,
  Title,
} from "@patternfly/react-core";
import { CrosshairsIcon } from "@patternfly/react-icons";

import { useDispatch } from "react-redux";
import { companyContextActions } from "store/company-context";

import {
  SimplePageSection,
  CompanyContextSelectorSection,
} from "shared/components";
import { CompanyContextSelectorContainer } from "shared/containers";

import { Company } from "api/models";
import { formatPath, Paths } from "Paths";

export const DocumentsNoCompany: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(companyContextActions.fetchCompaniesContext());
  }, [dispatch]);

  const handleOnChange = (company: Company) => {
    dispatch(companyContextActions.setCompanyContext(company.name));
    history.push(formatPath(Paths.documentList, { company: company.name }));
  };

  return (
    <>
      <CompanyContextSelectorSection>
        <CompanyContextSelectorContainer onChange={handleOnChange} />
      </CompanyContextSelectorSection>
      <SimplePageSection title="Documents" />
      <PageSection>
        <Bullseye>
          <EmptyState>
            <EmptyStateIcon icon={CrosshairsIcon} />
            <Title headingLevel="h4" size="lg">
              Select a company
            </Title>
            <EmptyStateBody>Select a company to see its data.</EmptyStateBody>
          </EmptyState>
        </Bullseye>
      </PageSection>
    </>
  );
};
