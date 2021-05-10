import React, { useState } from "react";
import { AxiosError, AxiosPromise, AxiosResponse } from "axios";

import { Alert } from "@patternfly/react-core";

import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import componentMapper from "@data-driven-forms/pf4-component-mapper/component-mapper";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";

import { Namespace } from "api/models";
import { createNamespace, getNamespaces, updateNamespace } from "api/rest";
import { getAxiosErrorMessage } from "utils/modelUtils";

interface IFormValue {
  name: string;
  description: string;
}

export interface INamespaceFormProps {
  namespace?: Namespace;
  onSaved: (response: AxiosResponse<Namespace>) => void;
  onCancel: () => void;
}

export const NamespaceForm: React.FC<INamespaceFormProps> = ({
  namespace,
  onSaved,
  onCancel,
}) => {
  const [error, setError] = useState<AxiosError>();

  const formSchema = {
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
          (value: string) => {
            return getNamespaces({ filterText: value }, { page: 1, perPage: 5 })
              .then(({ data }) => {
                const exits =
                  data.data.some((f) => f.name === value) &&
                  namespace?.name !== value;
                return exits ? "El nombre ya fue registrado" : undefined;
              })
              .catch(() => {
                throw Error("Could not verify data");
              });
          },
        ],
      },
      {
        component: componentTypes.TEXTAREA,
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
  };

  const formInitialValues: IFormValue = {
    name: namespace?.name || "",
    description: namespace?.description || "",
  };

  const onFormSubmit = (value: any) => {
    const formValue = value as IFormValue;

    const payload: Namespace = {
      name: formValue.name,
      description: formValue.description,
    };

    let promise: AxiosPromise<Namespace>;
    if (namespace) {
      promise = updateNamespace({
        ...namespace,
        ...payload,
      });
    } else {
      promise = createNamespace(payload);
    }

    return promise
      .then((response) => {
        onSaved(response);
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <>
      {error && (
        <Alert variant="danger" isInline title={getAxiosErrorMessage(error)} />
      )}
      <FormRenderer
        schema={formSchema}
        initialValues={formInitialValues}
        FormTemplate={(props) => (
          <FormTemplate
            submitLabel={!namespace ? "Crear" : "Guardar"}
            cancelLabel="Cancelar"
            {...props}
          />
        )}
        componentMapper={componentMapper}
        onSubmit={onFormSubmit}
        onCancel={onCancel}
      />
    </>
  );
};
