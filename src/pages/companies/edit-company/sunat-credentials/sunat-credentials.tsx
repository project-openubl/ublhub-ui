import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AxiosError } from "axios";

import { Card, CardBody } from "@patternfly/react-core";

import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import componentMapper from "@data-driven-forms/pf4-component-mapper/component-mapper";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";
import { getAxiosErrorMessage } from "utils/modelUtils";

import { useFetchCompany } from "shared/hooks";
import {
  AppPlaceholder,
  ConditionalRender,
  ErrorEmptyState,
} from "shared/components";

import { updateCompanySunatCredentials } from "api/rest";
import { CompanytRoute, formatPath, Paths } from "Paths";

import detailsCompanySchema from "./schemaForm";

export interface CompanyFormValues {
  username: string;
  password: string;
}

export const SunatCredentials: React.FC = () => {
  const dispatch = useDispatch();

  const params = useParams<CompanytRoute>();
  const history = useHistory();

  const { company, isFetching, fetchError, fetchCompany } = useFetchCompany();

  useEffect(() => {
    fetchCompany(params.company);
  }, [params, fetchCompany]);

  const formInitialValues: CompanyFormValues = {
    username: company?.credentials.username || "",
    password: "",
  };

  const handleOnSubmit = (formValues: any) => {
    return updateCompanySunatCredentials(params.company, formValues)
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
              <FormTemplate submitLabel="Save" {...props} />
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
