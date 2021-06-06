import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import { Alert, Card, CardBody } from "@patternfly/react-core";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import { useFetch } from "shared/hooks";
import { AppPlaceholder, ConditionalRender } from "shared/components";

import { EditKeyRoute, formatPath, NewKeyRoute, Paths } from "Paths";
import {
  ComponentRepresentation,
  ComponentTypeRepresentation,
  ServerInfoRepresentation,
} from "api/models";
import {
  createCompanyComponent,
  getCompanyComponent,
  getServerInfo,
  updateCompanyComponent,
} from "api/rest";
import { getAxiosErrorMessage } from "utils/modelUtils";

import { KeyForm } from "./components/key-form";
import { AxiosPromise } from "axios";

export const KeyCreateUpdate: React.FC = () => {
  // Router
  const { namespaceId, companyId, providerId } = useParams<NewKeyRoute>();
  const { componentId } = useParams<EditKeyRoute>();

  const history = useHistory();

  // Redux
  const dispatch = useDispatch();

  // Component type
  const [componentType, setComponentType] =
    useState<ComponentTypeRepresentation>();

  // Server info
  const {
    data: serverInfo,
    isFetching: isFetchingServerInfo,
    fetchError: fetchErrorServerInfo,
    requestFetch: refreshServerInfo,
  } = useFetch<ServerInfoRepresentation>({
    defaultIsFetching: true,
    onFetch: getServerInfo,
  });

  useEffect(() => {
    refreshServerInfo();
  }, [refreshServerInfo]);

  useEffect(() => {
    if (serverInfo) {
      const keyProviders = serverInfo.componentTypes.keyProviders;
      for (let i = 0; i < keyProviders.length; i++) {
        const provider = keyProviders[i];
        if (provider.id === providerId) {
          setComponentType(provider);
        }
      }
    }
  }, [providerId, serverInfo]);

  // Component to edit
  const fetchComponent = useCallback(() => {
    return getCompanyComponent(namespaceId, companyId, componentId);
  }, [namespaceId, companyId, componentId]);

  const {
    data: component,
    // isFetching: isFetchingComponent,
    // fetchError: fetchErrorComponent,
    requestFetch: refreshComponent,
  } = useFetch<ComponentRepresentation>({
    onFetch: fetchComponent,
  });

  useEffect(() => {
    if (componentId) {
      refreshComponent();
    }
  }, [componentId, refreshComponent]);

  // Form
  const onSubmit = (values: any) => {
    const { name, ...restValues } = values;
    const payload: any = {
      name,
      parentId: companyId,
      providerId: providerId,
      providerType: "io.github.project.openubl.xsender.keys.KeyProvider",
      config: Object.keys(restValues).reduce(
        (accumulator: any, currentKey: string) => {
          accumulator[currentKey] = [restValues[currentKey].toString()];
          return accumulator;
        },
        {} as any
      ),
    };

    let promise: AxiosPromise;
    if (component) {
      promise = updateCompanyComponent(namespaceId, companyId, {
        ...component,
        ...payload,
      });
    } else {
      promise = createCompanyComponent(namespaceId, companyId, payload);
    }

    return promise
      .then(() => {
        redirectToKeyList();
      })
      .catch((error) => {
        dispatch(alertActions.addErrorAlert(getAxiosErrorMessage(error)));
      });
  };

  const redirectToKeyList = () => {
    history.push(
      formatPath(Paths.editCompany_keys, { namespaceId, companyId })
    );
  };

  if (fetchErrorServerInfo) {
    return (
      <Alert title="error">{getAxiosErrorMessage(fetchErrorServerInfo)}</Alert>
    );
  }

  return (
    <Card>
      <CardBody>
        <ConditionalRender
          when={isFetchingServerInfo}
          then={<AppPlaceholder />}
        >
          {componentType && (
            <KeyForm
              component={component}
              componentType={componentType}
              onSubmit={onSubmit}
              onCancel={redirectToKeyList}
            />
          )}
        </ConditionalRender>
      </CardBody>
    </Card>
  );
};
