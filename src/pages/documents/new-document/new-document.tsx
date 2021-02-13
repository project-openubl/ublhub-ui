import React from "react";
import { RouteComponentProps, useParams } from "react-router-dom";

import { PageSection } from "@patternfly/react-core";

import { SimplePageSection } from "shared/components";
import { CompanytRoute, formatPath, Paths } from "Paths";

import { CompanyContextSelectorSection } from "../components/company-context-selector-section";
import { CompanyContextSelector } from "../components/company-context-selector/company-context-selector";

export interface NewDocumentProps extends RouteComponentProps {}

export const NewDocument: React.FC<NewDocumentProps> = () => {
  const params = useParams<CompanytRoute>();

  return (
    <>
      <CompanyContextSelectorSection>
        <CompanyContextSelector />
      </CompanyContextSelectorSection>
      <SimplePageSection
        title="Upload document"
        breadcrumbs={[
          {
            title: "Documents",
            path: formatPath(Paths.documents_byCompany, {
              company: params.company,
            }),
          },
          {
            title: "upload",
            path: formatPath(Paths.documents_byCompany_new, {
              company: params.company,
            }),
          },
        ]}
      />
      <PageSection>new document</PageSection>
    </>
  );
};
