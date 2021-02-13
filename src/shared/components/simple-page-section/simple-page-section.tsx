import React from "react";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Stack,
  StackItem,
  Split,
} from "@patternfly/react-core";

import { BreadCrumbPath } from "../breadcrumb-path";

export interface SimplePageSectionProps {
  title: string;
  description?: string;
  breadcrumbs?: { title: string; path: string }[];
}

export const SimplePageSection: React.FC<SimplePageSectionProps> = ({
  title,
  description,
  breadcrumbs,
}) => {
  return (
    <PageSection variant={PageSectionVariants.light}>
      <Stack hasGutter>
        {breadcrumbs && (
          <StackItem>
            <BreadCrumbPath breadcrumbs={breadcrumbs} />
          </StackItem>
        )}
        <StackItem>
          <TextContent>
            <Text component="h1">{title}</Text>
            {description && <Text component="small">{description}</Text>}
          </TextContent>
        </StackItem>
      </Stack>
    </PageSection>
  );
};
