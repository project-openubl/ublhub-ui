import React from "react";
import {
  FormGroup as Pf4FormGroup,
  TextContent,
  Text,
} from "@patternfly/react-core";
import showError from "./ShowError";

export interface FormGroupProps {
  label: string;
  isRequired: boolean;
  helperText: string;
  meta: any;
  description: string;
  hideLabel: boolean;
  children: any;
  id: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  isRequired,
  helperText,
  meta,
  description,
  hideLabel,
  children,
  id,
}) => (
  <Pf4FormGroup
    isRequired={isRequired}
    label={!hideLabel && label}
    fieldId={id}
    helperText={helperText}
    helperTextInvalid={meta.error}
    // validated
    {...showError(meta)}
  >
    {description && (
      <TextContent>
        <Text component="small">{description}</Text>
      </TextContent>
    )}
    {children}
  </Pf4FormGroup>
);