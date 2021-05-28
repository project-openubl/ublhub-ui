import React from "react";

import { SelectVariant, ToolbarChip } from "@patternfly/react-core";
import { SimpleSelect, OptionWithValue } from "shared/components";
import { DEFAULT_SELECT_MAX_HEIGHT } from "Constants";

interface DocumenType {
  key: string;
  label: string;
}

const documentTypes: DocumenType[] = [
  { key: "Invoice", label: "Boleta/factura" },
  { key: "CreditNote", label: "Nota de crétido" },
  { key: "DebitNote", label: "Nota de débito" },
  { key: "VoidedDocument", label: "Baja" },
  { key: "SummaryDocument", label: "Resumen diario" },
];

const companyToToolbarChip = (value: DocumenType): ToolbarChip => ({
  key: value.key,
  node: value.label,
});

const documentToOption = (
  value: DocumenType
): OptionWithValue<DocumenType> => ({
  value,
  toString: () => value.label,
  compareTo: (selectOption: any) => {
    // If "string" we are just filtering
    if (typeof selectOption === "string") {
      return value.label.toLowerCase().includes(selectOption.toLowerCase());
    }
    // If not "string" we are selecting a checkbox
    else {
      return (
        selectOption.value &&
        (selectOption as OptionWithValue<DocumenType>).value.key === value.key
      );
    }
  },
  props: {
    description: value.key,
  },
});

export interface ISelectDocumentTypeFilterProps {
  value?: ToolbarChip[];
  onApplyFilter: (values: ToolbarChip[]) => void;
}

export const SelectDocumentTypeFilter: React.FC<ISelectDocumentTypeFilterProps> = ({
  value = [],
  onApplyFilter,
}) => {
  return (
    <SimpleSelect
      variant={SelectVariant.checkbox}
      aria-label="document-type"
      aria-labelledby="document-type"
      placeholderText="Documento"
      maxHeight={DEFAULT_SELECT_MAX_HEIGHT}
      value={value
        .map((f) => documentTypes.find((b) => b.key === f.key))
        .filter((f) => f !== undefined)
        .map((f) => documentToOption(f!))}
      options={documentTypes.map(documentToOption)}
      onChange={(option) => {
        const optionValue = (option as OptionWithValue<DocumenType>).value;

        const elementExists = value.some((f) => f.key === optionValue.key);
        let newRUCs: ToolbarChip[];
        if (elementExists) {
          newRUCs = value.filter((f) => f.key !== optionValue.key);
        } else {
          newRUCs = [...value, companyToToolbarChip(optionValue)];
        }

        onApplyFilter(newRUCs);
      }}
      hasInlineFilter
      onClear={() => onApplyFilter([])}
    />
  );
};
