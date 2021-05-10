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
        Bienvenido a XSender
      </Title>
      <EmptyStateBody>
        XSender te permite enviar tus archivos XML a la SUNAT en gran escala.
        Empieza creando un namespace para tus empresas.
      </EmptyStateBody>
      <Button variant="primary" onClick={onPrimaryAction}>
        Crear namespace
      </Button>
      <EmptyStateSecondaryActions>
        Para conocer más visita la
        <a
          target="_blank"
          href="https://project-openubl.github.io"
          rel="noopener noreferrer"
        >
          documentación.
        </a>
      </EmptyStateSecondaryActions>
    </EmptyState>
  );
};
