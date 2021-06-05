import React, { useCallback, useEffect } from "react";

import { SelectVariant, ToolbarChip } from "@patternfly/react-core";

import { SimpleSelectFetch, OptionWithValue } from "shared/components";
import { useFetch } from "shared/hooks";

import { Company, PageRepresentation } from "api/models";
import { DEFAULT_SELECT_MAX_HEIGHT } from "Constants";
import { CompanySortBy, getCompanies } from "api/rest";

const companyToToolbarChip = (value: Company): ToolbarChip => ({
  key: value.ruc,
  node: value.ruc,
});

const companyToOption = (value: Company): OptionWithValue<Company> => ({
  value,
  toString: () => value.ruc,
  compareTo: (selectOption: any) => {
    // If "string" we are just filtering
    if (typeof selectOption === "string") {
      return (
        value.ruc.toLowerCase().includes(selectOption.toLowerCase()) ||
        value.name.toLowerCase().includes(selectOption.toLowerCase())
      );
    }
    // If not "string" we are selecting a checkbox
    else {
      return (
        selectOption.value &&
        (selectOption as OptionWithValue<Company>).value.id === value.id
      );
    }
  },
  props: {
    description: value.name,
  },
});

export interface ISelectCompanyFilterProps {
  namespaceId: string;
  value?: ToolbarChip[];
  onApplyFilter: (values: ToolbarChip[]) => void;
}

export const SelectCompanyFilter: React.FC<ISelectCompanyFilterProps> = ({
  namespaceId,
  value = [],
  onApplyFilter,
}) => {
  const fetchCompanies = useCallback(() => {
    return getCompanies(
      namespaceId,
      {},
      { page: 1, perPage: 1000 },
      {
        field: CompanySortBy.NAME,
      }
    );
  }, [namespaceId]);

  const {
    data: companies,
    isFetching: isFetchingCompanies,
    fetchError: fetchErrorCompanies,
    requestFetch: refreshCompanyList,
  } = useFetch<PageRepresentation<Company>>({
    defaultIsFetching: true,
    onFetch: fetchCompanies,
  });

  useEffect(() => {
    refreshCompanyList();
  }, [refreshCompanyList]);

  return (
    <SimpleSelectFetch
      variant={SelectVariant.checkbox}
      aria-label="company"
      aria-labelledby="company"
      placeholderText="Empresa"
      maxHeight={DEFAULT_SELECT_MAX_HEIGHT}
      value={value
        .map((f) => (companies?.data || []).find((b) => b.ruc === f.key))
        .filter((f) => f !== undefined)
        .map((f) => companyToOption(f!))}
      options={(companies?.data || []).map(companyToOption)}
      onChange={(option) => {
        const optionValue = (option as OptionWithValue<Company>).value;

        const elementExists = value.some((f) => f.key === optionValue.ruc);
        let newRUCs: ToolbarChip[];
        if (elementExists) {
          newRUCs = value.filter((f) => f.key !== optionValue.ruc);
        } else {
          newRUCs = [...value, companyToToolbarChip(optionValue)];
        }

        onApplyFilter(newRUCs);
      }}
      isFetching={isFetchingCompanies}
      fetchError={fetchErrorCompanies}
      hasInlineFilter
      onClear={() => onApplyFilter([])}
    />
  );
};
