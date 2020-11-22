import React from "react";
import {
  EmptyState,
  Title,
  EmptyStateBody,
  Button,
  EmptyStateVariant,
  EmptyStateSecondaryActions,
  EmptyStateIcon,
} from "@patternfly/react-core";
import { RocketIcon } from "@patternfly/react-icons";

export interface WelcomeProps {
  onPrimaryAction: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onPrimaryAction }) => {
  return (
    <EmptyState variant={EmptyStateVariant.large}>
      <EmptyStateIcon icon={RocketIcon} />
      <Title headingLevel="h4" size="lg">
        Welcome to XSender
      </Title>
      <EmptyStateBody>
        XSender helps you to send your XML files to the SUNAT on a large-scale.
        Start by creating a company for your XMLs.
      </EmptyStateBody>
      <Button variant="primary" onClick={onPrimaryAction}>
        Create company
      </Button>
      <EmptyStateSecondaryActions>
        To learn more, visit the
        <a
          target="_blank"
          href="https://project-openubl.github.io"
          rel="noopener noreferrer"
        >
          documentation.
        </a>
      </EmptyStateSecondaryActions>
    </EmptyState>
  );
};
