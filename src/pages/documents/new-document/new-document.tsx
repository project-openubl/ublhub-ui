import React from "react";
import { RouteComponentProps, useParams } from "react-router-dom";

import { Card, CardBody, PageSection } from "@patternfly/react-core";

import { SimplePageSection, UploadFilesDropzone } from "shared/components";
import { NamespaceRoute, formatPath, Paths } from "Paths";
import { DOCUMENTS } from "api/rest";

const getUploadUrl = (company: string) => {
  return DOCUMENTS.replace(":company", company);
};

export interface NewDocumentProps extends RouteComponentProps {}

export const NewDocument: React.FC<NewDocumentProps> = () => {
  const params = useParams<NamespaceRoute>();

  return (
    <>
      <SimplePageSection
        title="Upload"
        description="Upload your XML files using the dropzone below."
        breadcrumbs={[
          {
            title: "Documents",
            path: formatPath(Paths.documentList, {
              company: params.namespaceId,
            }),
          },
          {
            title: "upload",
            path: formatPath(Paths.newDocument, {
              company: params.namespaceId,
            }),
          },
        ]}
      />
      <PageSection>
        <Card>
          <CardBody>
            <UploadFilesDropzone
              accept=".xml"
              url={getUploadUrl(params.namespaceId)}
            />
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};
