import React from "react";
import { RouteComponentProps, useParams } from "react-router-dom";

import { Card, CardBody, PageSection } from "@patternfly/react-core";

import { SimplePageSection, UploadFilesDropzone } from "shared/components";
import { CompanytRoute, formatPath, Paths } from "Paths";
import { DOCUMENTS } from "api/rest";

import { CompanyContextSelectorSection } from "../components/company-context-selector-section";
import { CompanyContextSelector } from "../components/company-context-selector/company-context-selector";

const getUploadUrl = (company: string) => {
  return DOCUMENTS.replace(":company", company);
};

export interface NewDocumentProps extends RouteComponentProps {}

export const NewDocument: React.FC<NewDocumentProps> = () => {
  const params = useParams<CompanytRoute>();

  return (
    <>
      <CompanyContextSelectorSection>
        <CompanyContextSelector />
      </CompanyContextSelectorSection>
      <SimplePageSection
        title="Upload"
        description="Upload your XML files using the dropzone below."
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
      <PageSection>
        <Card>
          <CardBody>
            <UploadFilesDropzone
              accept=".xml"
              url={getUploadUrl(params.company)}
            />
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};
