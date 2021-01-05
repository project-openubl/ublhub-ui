import React from "react";
import { AxiosError } from "axios";
import {
  EmptyState,
  Title,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateIcon,
} from "@patternfly/react-core";
import { ConnectedIcon } from "@patternfly/react-icons";

export interface ErrorEmptyStateProps {
  error: AxiosError;
}

export const ErrorEmptyState: React.FC<ErrorEmptyStateProps> = ({ error }) => {
  return (
    <EmptyState variant={EmptyStateVariant.large}>
      <EmptyStateIcon icon={ConnectedIcon} />
      <Title headingLevel="h4" size="lg">
        {error.code}
      </Title>
      <EmptyStateBody>{error.message}</EmptyStateBody>
    </EmptyState>
  );
};
