import React from "react";

import {
  ToggleGroup,
  ToggleGroupItem,
  ToolbarChip,
} from "@patternfly/react-core";

export interface IToolbarDocumentProps {
  docTypeValue?: ToolbarChip;
  docTypeOptions: ToolbarChip[];
  onDocTypeChange: (value: ToolbarChip) => void;
}

export const ToolbarDocument: React.FC<IToolbarDocumentProps> = ({
  docTypeValue,
  docTypeOptions,
  onDocTypeChange,
}) => {
  return (
    <ToggleGroup>
      {docTypeOptions.map((elem) => (
        <ToggleGroupItem
          key={elem.key}
          text={elem.node}
          buttonId={elem.key}
          isSelected={elem.key === docTypeValue?.key}
          onChange={(isSelected, event) => {
            const id = event.currentTarget.id;
            const selectedOption = docTypeOptions.find((f) => f.key === id);
            if (selectedOption) {
              onDocTypeChange(selectedOption);
            }
          }}
        />
      ))}
    </ToggleGroup>
  );
};
