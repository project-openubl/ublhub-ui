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

import { useSelector } from "react-redux";
import { RootState } from "store/rootReducer";
import { companyContextSelectors } from "store/company-context";

import { SimplePageSection } from "shared/components";
import { formatPath, Paths } from "Paths";

import { CompanyContextSelectorSection } from "../components/company-context-selector-section";
import { CompanyContextSelector } from "../components/company-context-selector/company-context-selector";

export const SelectCompany: React.FC = () => {
  const history = useHistory();

  const currentCompany = useSelector((state: RootState) =>
    companyContextSelectors.currentCompany(state)
  );

  useEffect(() => {
    if (currentCompany) {
      history.push(
        formatPath(Paths.documents_byCompany, {
          company: currentCompany,
        })
      );
    }
  }, [currentCompany, history]);

  return (
    <>
      <CompanyContextSelectorSection>
        <CompanyContextSelector />
      </CompanyContextSelectorSection>
      <SimplePageSection title="Documents" />
      <PageSection>
        <Bullseye>
          <EmptyState>
            <EmptyStateIcon icon={CrosshairsIcon} />
            <Title headingLevel="h4" size="lg">
              Select a company
            </Title>
            <EmptyStateBody>Select a company to see his data.</EmptyStateBody>
          </EmptyState>
        </Bullseye>
      </PageSection>
    </>
  );
};
