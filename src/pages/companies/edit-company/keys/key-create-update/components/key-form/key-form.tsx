import React, { useMemo } from "react";

import { Schema } from "@data-driven-forms/react-form-renderer";
import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";

import {
  oulComponentMapper,
  oulComponentTypes,
} from "shared/ddf/oul-component-mapper";

import {
  ComponentRepresentation,
  ComponentTypeRepresentation,
  ConfigPropertyRepresentation,
} from "api/models";

const getComponentFields = (
  value: ConfigPropertyRepresentation
): {
  component: string;
  type: string | undefined;
  options: {
    label: string;
    value: string;
  }[];
  validate: any[];
} => {
  let component: string;
  switch (value.type) {
    case "String":
    case "Password":
      component = componentTypes.TEXT_FIELD;
      break;
    case "File":
      component = oulComponentTypes.TEXT_FIELD_CERTIFICATE;
      break;
    case "boolean":
      component = componentTypes.SWITCH;
      break;
    case "List":
      component = componentTypes.SELECT;
      break;
    default:
      throw new Error("Component type:" + value + " unsupported");
  }

  let type: string | undefined = undefined;
  switch (value.type) {
    case "Password":
      type = "password";
      break;
    case "File":
      type = "text";
      break;
  }

  let validate: any[] = [];
  switch (value.type) {
    case "String":
    case "Password":
    case "File":
    case "List":
      validate.push({
        type: validatorTypes.REQUIRED,
        message: "This field is required",
      });
      break;
  }

  return {
    component,
    type: type,
    options: value.options?.map((o) => ({ label: o, value: o })),
    validate: [],
  };
};

export interface IKeyFormProps {
  component?: ComponentRepresentation;
  componentType: ComponentTypeRepresentation;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export const KeyForm: React.FC<IKeyFormProps> = ({
  component,
  componentType,
  onSubmit,
  onCancel,
}) => {
  const schema: Schema = {
    fields: [
      {
        name: "name",
        label: "Name",
        component: componentTypes.TEXT_FIELD,
        isRequired: true,
        initialValue: componentType.id,
        validate: [
          { type: validatorTypes.REQUIRED, message: "This field is required" },
          {
            type: validatorTypes.PATTERN,
            pattern: "^[-a-zA-Z0-9]+$",
            message: "Invalid value",
          },
        ],
      },
      ...componentType.properties.map((e: ConfigPropertyRepresentation) => ({
        name: e.name,
        label: e.label,
        initialValue: e.defaultValue,
        isRequired: true,
        ...getComponentFields(e),
      })),
    ],
  };

  const initialValues = useMemo(() => {
    if (component) {
      const result: any = {};

      result.name = component.name;
      componentType.properties.forEach((e: ConfigPropertyRepresentation) => {
        const configValue = component.config[e.name];
        switch (e.type) {
          case "boolean":
            result[e.name] = configValue
              ? configValue[0] === "true"
              : undefined;
            break;
          default:
            result[e.name] = configValue ? configValue[0] : undefined;
            break;
        }
      });

      return result;
    }

    return undefined;
  }, [component, componentType]);

  return (
    <FormRenderer
      initialValues={initialValues}
      schema={schema}
      FormTemplate={(props) => (
        <FormTemplate
          submitLabel={component ? "Guardar" : "Crear"}
          cancelLabel="Cancelar"
          {...props}
        />
      )}
      componentMapper={oulComponentMapper}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};
