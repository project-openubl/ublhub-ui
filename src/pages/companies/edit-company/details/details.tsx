import React, { useCallback, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AxiosError } from "axios";

import { Card, CardBody } from "@patternfly/react-core";

import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import componentMapper from "@data-driven-forms/pf4-component-mapper/component-mapper";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";
import { getAxiosErrorMessage } from "utils/modelUtils";

import {
  AppPlaceholder,
  ConditionalRender,
  ErrorEmptyState,
} from "shared/components";

import { getCompanies, getCompany, updateCompany } from "api/rest";
import { formatPath, Paths, CompanyRoute } from "Paths";

import { Company } from "api/models";
import { useFetch } from "shared/hooks";

export interface IFormValue {
  name: string;
  ruc: string;
  description: string;
  webServices: {
    factura: string;
    guia: string;
    retenciones: string;
  };
  credentials: {
    username: string;
    password: string;
  };
}

export const Details: React.FC = () => {
  const dispatch = useDispatch();

  const history = useHistory();
  const { namespaceId, companyId } = useParams<CompanyRoute>();

  const fetchCompany = useCallback(() => {
    return getCompany(namespaceId, companyId);
  }, [namespaceId, companyId]);

  const {
    data: company,
    isFetching: isFetchingCompany,
    fetchError: fetchErrorCompany,
    requestFetch: refreshCompany,
  } = useFetch<Company>({
    defaultIsFetching: true,
    onFetch: fetchCompany,
  });

  useEffect(() => {
    refreshCompany();
  }, [refreshCompany]);

  const formSchema = {
    fields: [
      {
        component: "sub-form",
        title: "Empresa",
        name: "details",
        fields: [
          {
            component: componentTypes.TEXT_FIELD,
            name: "name",
            label: "Nombre",
            type: "text",
            isRequired: true,
            validate: [
              {
                type: "required",
              },
              {
                type: "min-length",
                threshold: 3,
              },
            ],
          },
          {
            component: componentTypes.TEXT_FIELD,
            name: "ruc",
            label: "RUC",
            type: "text",
            isRequired: true,
            validate: [
              {
                type: "required",
              },
              {
                type: "min-length",
                threshold: 11,
              },
              {
                type: "max-length",
                threshold: 11,
              },
              (value: string) => {
                return getCompanies(
                  namespaceId,
                  { filterText: value },
                  { page: 1, perPage: 5 }
                )
                  .then(({ data }) => {
                    const exits =
                      data.data.some((f) => f.ruc === value) &&
                      company?.ruc !== value;
                    return exits ? "El nombre ya fue registrado" : undefined;
                  })
                  .catch(() => {
                    throw Error("Could not verify data");
                  });
              },
            ],
          },
          {
            component: "textarea",
            name: "description",
            label: "Descripción",
            type: "text",
            isRequired: false,
            validate: [
              {
                type: "max-length",
                threshold: 250,
              },
            ],
          },
        ],
      },
      {
        component: "sub-form",
        title: "SUNAT Web services",
        name: "webServices",
        fields: [
          {
            component: "text-field",
            name: "webServices.factura",
            label: "Factura",
            type: "text",
            isRequired: true,
            validate: [
              {
                type: "required",
              },
              {
                type: "min-length",
                threshold: 1,
              },
              {
                type: "url",
              },
            ],
          },
          {
            component: "text-field",
            name: "webServices.guia",
            label: "Guía",
            type: "text",
            isRequired: true,
            validate: [
              {
                type: "required",
              },
              {
                type: "min-length",
                threshold: 1,
              },
              {
                type: "url",
              },
            ],
          },
          {
            component: "text-field",
            name: "webServices.retenciones",
            label: "Retenciones",
            type: "text",
            isRequired: true,
            validate: [
              {
                type: "required",
              },
              {
                type: "min-length",
                threshold: 1,
              },
              {
                type: "url",
              },
            ],
          },
        ],
      },
      {
        component: "sub-form",
        title: "SUNAT Credentials",
        name: "credentials",
        fields: [
          {
            component: "text-field",
            name: "credentials.username",
            label: "Username",
            type: "text",
            isRequired: true,
            validate: [
              {
                type: "required",
              },
              {
                type: "min-length",
                threshold: 3,
              },
            ],
          },
          {
            component: "text-field",
            name: "credentials.password",
            label: "Password",
            type: "password",
            isRequired: false,
            validate: [],
          },
        ],
      },
    ],
  };

  const formInitialValues: IFormValue = {
    ruc: company?.ruc || "",
    name: company?.name || "",
    description: company?.description || "",
    webServices: {
      factura: company?.webServices.factura || "",
      guia: company?.webServices.guia || "",
      retenciones: company?.webServices.retenciones || "",
    },
    credentials: {
      username: company?.credentials.username || "",
      password: company?.credentials.password || "",
    },
  };

  const onFormSubmit = (value: any) => {
    const formValue = value as IFormValue;

    const payload: Company = {
      ...company,
      ruc: formValue.ruc,
      name: formValue.name,
      description: formValue.description,
      webServices: {
        factura: formValue.webServices.factura,
        retenciones: formValue.webServices.retenciones,
        guia: formValue.webServices.guia,
      },
      credentials: {
        username: formValue.credentials.username,
        password:
          formValue.credentials.password.trim().length > 0
            ? formValue.credentials.password.trim()
            : undefined,
      },
    };

    return updateCompany(namespaceId, payload)
      .then(() => {
        redirectToCompanyOverviewPage();
      })
      .catch((error: AxiosError) => {
        dispatch(alertActions.addErrorAlert(getAxiosErrorMessage(error)));
      });
  };

  const redirectToCompanyOverviewPage = () => {
    history.push(
      formatPath(Paths.editCompany_overview, {
        namespaceId,
        companyId: companyId,
      })
    );
  };

  if (fetchErrorCompany) {
    return (
      <Card>
        <CardBody>
          <ErrorEmptyState error={fetchErrorCompany} />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <ConditionalRender when={isFetchingCompany} then={<AppPlaceholder />}>
          <FormRenderer
            initialValues={formInitialValues}
            schema={formSchema}
            FormTemplate={(props) => (
              <FormTemplate
                submitLabel="Guardar"
                cancelLabel="Cancelar"
                {...props}
              />
            )}
            componentMapper={componentMapper}
            onSubmit={onFormSubmit}
            onCancel={redirectToCompanyOverviewPage}
          />
        </ConditionalRender>
      </CardBody>
    </Card>
  );
};
