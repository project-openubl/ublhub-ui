import React, { useState } from "react";

import useFieldApi, {
  UseFieldApiConfig,
} from "@data-driven-forms/react-form-renderer/use-field-api";

import { FileUpload } from "@patternfly/react-core";
import { FormGroup } from "./common/FormGroup";
import showError from "./common/ShowError";

export const OulTextFieldCertificate: React.FC<UseFieldApiConfig> = (props) => {
  const {
    label,
    isRequired,
    helperText,
    meta,
    description,
    hideLabel,
    input,
    isReadOnly,
    isDisabled,
    id,
    type,
    ...rest
  } = useFieldApi(props);

  const [isLoading, setIsLoading] = useState<boolean>();
  const [filename, setFilename] = useState<string>();

  return (
    <FormGroup
      label={label}
      isRequired={isRequired}
      helperText={helperText}
      meta={meta}
      description={description}
      hideLabel={hideLabel}
      id={id || input.name}
    >
      <FileUpload
        filename={filename}
        onReadStarted={() => setIsLoading(true)}
        onReadFinished={() => setIsLoading(false)}
        isLoading={isLoading}
        allowEditingUploadedText={false}
        type={type}
        {...input}
        {...rest}
        id={id || input.name}
        isReadOnly={isReadOnly}
        isDisabled={isDisabled}
        {...showError(meta)}
        onChange={(value: string | File, filename: string) => {
          setFilename(filename);
          input.onChange(value);
        }}
      />
    </FormGroup>
  );
};
