import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { PageSection } from "@patternfly/react-core";

import { SimplePageSection } from "shared/components";

export interface DocumentListProps extends RouteComponentProps {}

export const DocumentList: React.FC<DocumentListProps> = () => {
  return (
    <>
      <SimplePageSection title="Documents" />
      <PageSection>document list</PageSection>
    </>
  );
};
