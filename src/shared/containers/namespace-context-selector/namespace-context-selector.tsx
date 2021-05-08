import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  namespaceContextActions,
  namespaceContextSelectors,
} from "store/namespace-context";
import { RootState } from "store/rootReducer";

import { NamespaceContextSelectorContainer } from "shared/containers";

import { NamespaceRoute, formatPath, Paths } from "Paths";
import { Namespace } from "api/models";

export interface INamespaceContextSelectorProps {
  url: Paths;
}

export const NamespaceContextSelector: React.FC<INamespaceContextSelectorProps> = ({
  url,
}) => {
  const dispatch = useDispatch();

  const history = useHistory();
  const { namespaceId } = useParams<NamespaceRoute>();

  const namespaces = useSelector((state: RootState) =>
    namespaceContextSelectors.namespaces(state)
  );

  useEffect(() => {
    dispatch(namespaceContextActions.fetchNamespacesContext());
  }, [dispatch]);

  useEffect(() => {
    if (namespaceId) {
      const ns = namespaces.find((f) => f.id === namespaceId);
      if (ns) {
        dispatch(namespaceContextActions.setNamespaceContext(ns));
      }
    }
  }, [namespaceId, namespaces, dispatch]);

  const handleOnChange = (namespace: Namespace) => {
    dispatch(namespaceContextActions.setNamespaceContext(namespace));
    history.push(formatPath(url, { namespaceId: namespace.id }));
  };

  return <NamespaceContextSelectorContainer onChange={handleOnChange} />;
};
