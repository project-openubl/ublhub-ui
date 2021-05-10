import React from "react";
import { useParams } from "react-router-dom";

import { Card, CardBody, PageSection } from "@patternfly/react-core";

import { SimplePageSection, UploadFilesDropzone } from "shared/components";
import { NamespaceRoute, formatPath, Paths } from "Paths";
import { getUploadUrl } from "api/rest";

export const UploadDocument: React.FC = () => {
  const { namespaceId } = useParams<NamespaceRoute>();

  return (
    <>
      <SimplePageSection
        title="Importar XMLs"
        description="Importa tus XMLs subiendo tus archivos."
        breadcrumbs={[
          {
            title: "Documentos",
            path: formatPath(Paths.documentList, {
              namespaceId,
            }),
          },
          {
            title: "upload",
            path: "",
          },
        ]}
      />
      <PageSection>
        <Card>
          <CardBody>
            <UploadFilesDropzone
              accept=".xml"
              url={getUploadUrl(namespaceId)}
            />
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};
