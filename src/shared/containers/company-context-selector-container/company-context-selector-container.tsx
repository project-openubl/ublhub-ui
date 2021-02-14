import React from "react";
import { useSelector } from "react-redux";

import { SimpleContextSelector } from "shared/components";

import { RootState } from "store/rootReducer";
import { companyContextSelectors } from "store/company-context";

import { Company } from "api/models";

export interface CompanyContextSelectorContainerProps {
  onChange: (company: Company) => void;
}

export const CompanyContextSelectorContainer: React.FC<CompanyContextSelectorContainerProps> = ({
  onChange,
}) => {
  const companies = useSelector((state: RootState) =>
    companyContextSelectors.companies(state)
  );
  const currentCompany = useSelector((state: RootState) =>
    companyContextSelectors.currentCompany(state)
  );

  const handleOnChange = (value: string) => {
    const company = companies.find((f) => f.name === value);
    if (company) {
      onChange(company);
    }
  };

  return (
    <SimpleContextSelector
      value={currentCompany}
      items={companies.map((f) => f.name)}
      onChange={handleOnChange}
    />
  );
};
