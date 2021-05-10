import React, { useState } from "react";
import { RouteComponentProps, useParams } from "react-router-dom";

import {
  Alert,
  Button,
  Flex,
  FlexItem,
  PageSection,
  Stack,
  StackItem,
} from "@patternfly/react-core";

import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import componentMapper from "@data-driven-forms/pf4-component-mapper/component-mapper";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import { formatPath, NamespaceRoute, Paths } from "Paths";

import { createCompany, getCompanies } from "api/rest";
import { AxiosError } from "axios";
import { getAxiosErrorMessage } from "utils/modelUtils";
import { Company } from "api/models";

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

const BETA_TEMPLATE: IFormValue = {
  name: "",
  ruc: "",
  description: "This is a test company",
  credentials: {
    username: "12345678959MODDATOS",
    password: "MODDATOS",
  },
  webServices: {
    factura: "https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService",
    guia:
      "https://e-beta.sunat.gob.pe/ol-ti-itemision-guia-gem-beta/billService",
    retenciones:
      "https://e-beta.sunat.gob.pe/ol-ti-itemision-otroscpe-gem-beta/billService",
  },
};

const PROD_TEMPLATE: IFormValue = {
  name: "",
  ruc: "",
  description: "",
  credentials: {
    username: "",
    password: "",
  },
  webServices: {
    factura: "https://e-factura.sunat.gob.pe/ol-ti-itcpfegem/billService",
    guia:
      "https://e-guiaremision.sunat.gob.pe/ol-ti-itemision-guia-gem/billService",
    retenciones:
      "https://e-factura.sunat.gob.pe/ol-ti-itemision-otroscpe-gem/billService",
  },
};

export interface CompanyListProps extends RouteComponentProps {}

export const NewCompany: React.FC<CompanyListProps> = ({ history }) => {
  const { namespaceId } = useParams<NamespaceRoute>();

  const dispatch = useDispatch();

  const [saveError, setSaveError] = useState<AxiosError>();

  const [formInitialValues, setFormInitialValues] = useState<IFormValue>();

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
                    const exits = data.data.some((f) => f.ruc === value);
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
        ],
      },
    ],
  };

  const onFormSubmit = (value: any) => {
    const formValue = value as IFormValue;

    const payload: Company = {
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
        password: formValue.credentials.password,
      },
    };

    return createCompany(namespaceId, payload)
      .then(() => {
        dispatch(alertActions.addSuccessAlert("Empresa creada."));
        redirectToCompanyListPage();
      })
      .catch((error: AxiosError) => {
        setSaveError(error);
      });
  };

  const redirectToCompanyListPage = () => {
    history.push(formatPath(Paths.companyList, { namespaceId }));
  };

  const applyBetaTemplate = () => {
    setFormInitialValues(BETA_TEMPLATE);
  };

  const applyProdTemplate = () => {
    setFormInitialValues(PROD_TEMPLATE);
  };

  return (
    <PageSection variant="light">
      <Stack hasGutter>
        <StackItem>
          <Flex>
            <FlexItem>
              <Button variant="secondary" onClick={applyBetaTemplate}>
                Beta
              </Button>
            </FlexItem>
            <FlexItem>
              <Button variant="secondary" onClick={applyProdTemplate}>
                Prod
              </Button>
            </FlexItem>
          </Flex>
        </StackItem>
        {saveError && (
          <StackItem>
            <Alert variant="danger" title={getAxiosErrorMessage(saveError)} />
          </StackItem>
        )}
        <StackItem>
          <FormRenderer
            initialValues={formInitialValues}
            schema={formSchema}
            FormTemplate={(props) => (
              <FormTemplate
                submitLabel="Crear"
                cancelLabel="Cancelar"
                {...props}
              />
            )}
            componentMapper={componentMapper}
            onSubmit={onFormSubmit}
            onCancel={redirectToCompanyListPage}
          />
        </StackItem>
      </Stack>
    </PageSection>
  );
};
