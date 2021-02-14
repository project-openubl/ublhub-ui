import React from "react";
import { Link, RouteComponentProps, useParams } from "react-router-dom";

import { PageSection } from "@patternfly/react-core";

import { CompanytRoute, formatPath, Paths } from "Paths";
import { SimplePageSection } from "shared/components";

export interface DocumentListProps extends RouteComponentProps {}

export const DocumentList: React.FC<DocumentListProps> = () => {
  const params = useParams<CompanytRoute>();

  return (
    <>
      <SimplePageSection title="Documents" />
      <PageSection>
        <Link
          to={formatPath(Paths.newDocument, {
            company: params.company,
          })}
        >
          Upload
        </Link>
      </PageSection>
    </>
  );
};
