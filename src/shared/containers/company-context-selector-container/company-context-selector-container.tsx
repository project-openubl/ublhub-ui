import React from "react";
import { useSelector } from "react-redux";

import { SimpleContextSelector } from "shared/components";

import { RootState } from "store/rootReducer";
import { namespaceContextSelectors } from "store/namespace-context";

import { Namespace } from "api/models";

export interface INamespaceContextSelectorContainerProps {
  onChange: (namespace: Namespace) => void;
}

export const NamespaceContextSelectorContainer: React.FC<INamespaceContextSelectorContainerProps> = ({
  onChange,
}) => {
  const namespaces = useSelector((state: RootState) =>
    namespaceContextSelectors.namespaces(state)
  );

  const currentNamespace = useSelector((state: RootState) =>
    namespaceContextSelectors.currentNamespace(state)
  );

  const handleOnChange = (value: Namespace) => {
    const namespace = namespaces.find((f) => f.id === value.id);
    if (namespace) {
      onChange(namespace);
    }
  };

  return (
    <SimpleContextSelector
      value={currentNamespace}
      items={namespaces}
      onChange={handleOnChange}
    />
  );
};
