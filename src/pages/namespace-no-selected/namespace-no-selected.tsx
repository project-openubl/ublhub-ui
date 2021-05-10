import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  PageSection,
  Title,
} from "@patternfly/react-core";
import { CrosshairsIcon } from "@patternfly/react-icons";

import { useDispatch } from "react-redux";
import { namespaceContextActions } from "store/namespace-context";

import { NamespaceContextSelectorSection } from "shared/components";
import { NamespaceContextSelectorContainer } from "shared/containers";

import { Namespace } from "api/models";
import { formatPath, Paths } from "Paths";

export interface INamespaceNoSelectedProps {
  path: Paths;
  titlePageSection: any;
}

export const NamespaceNoSelected: React.FC<INamespaceNoSelectedProps> = ({
  path,
  titlePageSection,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(namespaceContextActions.fetchNamespacesContext());
  }, [dispatch]);

  const handleOnChange = (namespace: Namespace) => {
    dispatch(namespaceContextActions.setNamespaceContext(namespace));
    history.push(formatPath(path, { namespaceId: namespace.id }));
  };

  return (
    <>
      <NamespaceContextSelectorSection>
        <NamespaceContextSelectorContainer onChange={handleOnChange} />
      </NamespaceContextSelectorSection>
      {titlePageSection}
      <PageSection>
        <Bullseye>
          <EmptyState>
            <EmptyStateIcon icon={CrosshairsIcon} />
            <Title headingLevel="h4" size="lg">
              Selecciona un namespace
            </Title>
            <EmptyStateBody>
              Selecciona un namespace para ver su contenido.
            </EmptyStateBody>
          </EmptyState>
        </Bullseye>
      </PageSection>
    </>
  );
};
