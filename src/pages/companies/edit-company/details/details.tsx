import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AxiosError } from "axios";

import { Card, CardBody } from "@patternfly/react-core";

import FormRenderer from "@data-driven-forms/react-form-renderer/dist/cjs/form-renderer";
import Pf4FormTemplate from "@data-driven-forms/pf4-component-mapper/dist/cjs/form-template";
import componentMapper from "@data-driven-forms/pf4-component-mapper/dist/cjs/component-mapper";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";
import { getAxiosErrorMessage } from "utils/modelUtils";

import { useFetchCompany } from "shared/hooks";
import {
  AppPlaceholder,
  ConditionalRender,
  ErrorEmptyState,
} from "shared/components";

import { updateCompany } from "api/rest";
import { CompanytRoute, formatPath, Paths } from "Paths";

import detailsCompanySchema from "./schemaForm";
import { Company } from "api/models";

export interface CompanyFormValues {
  name: string;
  description?: string;
  webServices: {
    factura: string;
    guia: string;
    retenciones: string;
  };
}

export const Details: React.FC = () => {
  const dispatch = useDispatch();

  const params = useParams<CompanytRoute>();
  const history = useHistory();

  const { company, isFetching, fetchError, fetchCompany } = useFetchCompany();

  useEffect(() => {
    fetchCompany(params.company);
  }, [params, fetchCompany]);

  const formInitialValues: CompanyFormValues = {
    name: company?.name || "",
    description: company?.description || "",
    webServices: {
      factura: company?.webServices.factura || "",
      guia: company?.webServices.guia || "",
      retenciones: company?.webServices.retenciones || "",
    },
  };

  const handleOnSubmit = (formValues: any) => {
    const companyPayload: Company = { ...formValues, id: company?.id };

    return updateCompany(companyPayload)
      .then(() => {
        history.push(
          formatPath(Paths.editCompany_overview, { company: params.company })
        );
      })
      .catch((error: AxiosError) => {
        dispatch(alertActions.addErrorAlert(getAxiosErrorMessage(error)));
      });
  };

  const handleOnCancel = () => {
    history.push(
      formatPath(Paths.editCompany_overview, { company: params.company })
    );
  };

  if (fetchError) {
    return (
      <Card>
        <CardBody>
          <ErrorEmptyState error={fetchError} />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <ConditionalRender when={isFetching} then={<AppPlaceholder />}>
          <FormRenderer
            schema={detailsCompanySchema}
            initialValues={formInitialValues}
            FormTemplate={(props) => (
              <Pf4FormTemplate submitLabel="Save" {...props} />
            )}
            componentMapper={componentMapper}
            onSubmit={handleOnSubmit}
            onCancel={handleOnCancel}
          />
        </ConditionalRender>
      </CardBody>
    </Card>
  );
};
