import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import { useDispatch } from "react-redux";
import { companyContextActions } from "store/company-context";

import { CompanyContextSelectorContainer } from "shared/containers";

import { CompanytRoute, formatPath, Paths } from "Paths";
import { Company } from "api/models";

export interface CompanyContextSelectorProps {
  url: Paths;
}

export const CompanyContextSelector: React.FC<CompanyContextSelectorProps> = ({
  url,
}) => {
  const dispatch = useDispatch();

  const history = useHistory();
  const { company } = useParams<CompanytRoute>();

  useEffect(() => {
    dispatch(companyContextActions.fetchCompaniesContext());
  }, [dispatch]);

  useEffect(() => {
    if (company) {
      dispatch(companyContextActions.setCompanyContext(company));
    }
  }, [company, dispatch]);

  const handleOnChange = (company: Company) => {
    dispatch(companyContextActions.setCompanyContext(company.name));
    history.push(formatPath(url, { company: company.name }));
  };

  return <CompanyContextSelectorContainer onChange={handleOnChange} />;
};
