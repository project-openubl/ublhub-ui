import React from "react";
import {
  Stack,
  StackItem,
  Split,
  SplitItem,
  TextContent,
  Text,
} from "@patternfly/react-core";
import { BreadCrumbPath } from "shared/components/breadcrumb-path";
import { MenuActions } from "shared/components/menu-actions";
import { HorizontalNav } from "shared/components/horizontal-nav/horizontal-nav";

export interface PageHeaderProps {
  title: string;
  breadcrumbs: { title: string; path: string }[];
  menuActions: { label: string; callback: () => void }[];
  navItems: { title: string; path: string }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  menuActions,
  navItems,
}) => {
  return (
    <Stack hasGutter>
      <StackItem>
        <BreadCrumbPath breadcrumbs={breadcrumbs} />
      </StackItem>
      <StackItem>
        <Split>
          <SplitItem isFilled>
            <TextContent>
              <Text component="h1">{title}</Text>
            </TextContent>
          </SplitItem>
          <SplitItem>
            <MenuActions actions={menuActions} />
          </SplitItem>
        </Split>
      </StackItem>
      <StackItem>
        <HorizontalNav navItems={navItems} />
      </StackItem>
    </Stack>
  );
};
