import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";

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
import componentMapper from "@data-driven-forms/pf4-component-mapper/component-mapper";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import { Paths } from "Paths";
import newCompanySchema from "./schemaForm";
import { createCompany } from "api/rest";
import { AxiosError } from "axios";
import { getAxiosErrorMessage } from "utils/modelUtils";

export interface NewCompanyFormValues {
  name: string;
  description?: string;
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

const BETA_TEMPLATE: NewCompanyFormValues = {
  name: "",
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

const PROD_TEMPLATE: NewCompanyFormValues = {
  name: "",
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
  const dispatch = useDispatch();
  const [conflictErrorMsg, setConflictErrorMsg] = useState("");
  const [initialValues, setInitialValues] = useState<NewCompanyFormValues>();

  const handleOnSubmit = (formValues: any) => {
    return createCompany(formValues)
      .then(() => {
        history.push(Paths.companyList);
        dispatch(alertActions.addSuccessAlert("Company successfully created."));
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 409) {
          setConflictErrorMsg(
            `The name '${formValues.name}' is already taken.`
          );
        } else {
          dispatch(alertActions.addErrorAlert(getAxiosErrorMessage(error)));
        }
      });
  };

  const handleOnCancel = () => {
    history.push(Paths.companyList);
  };

  const applyBetaTemplate = () => {
    setInitialValues(BETA_TEMPLATE);
  };

  const applyProdTemplate = () => {
    setInitialValues(PROD_TEMPLATE);
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
        {conflictErrorMsg && (
          <StackItem>
            <Alert variant="danger" title={conflictErrorMsg} />
          </StackItem>
        )}
        <StackItem>
          <FormRenderer
            initialValues={initialValues}
            schema={newCompanySchema}
            FormTemplate={(props) => (
              <FormTemplate submitLabel="Create" {...props} />
            )}
            componentMapper={componentMapper}
            onSubmit={handleOnSubmit}
            onCancel={handleOnCancel}
          />
        </StackItem>
      </Stack>
    </PageSection>
  );
};
