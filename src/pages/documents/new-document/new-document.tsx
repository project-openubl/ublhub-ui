import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { PageSection } from "@patternfly/react-core";

export interface NewDocumentProps extends RouteComponentProps {}

export const NewDocument: React.FC<NewDocumentProps> = () => {
  return <PageSection variant="light">new document</PageSection>;
};
