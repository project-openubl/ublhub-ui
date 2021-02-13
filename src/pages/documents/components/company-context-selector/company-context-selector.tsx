import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useDispatch } from "react-redux";
import { companyContextActions } from "store/company-context";

import { CompanyContextSelectorContainer } from "shared/containers";

import { CompanytRoute } from "Paths";
import { Company } from "api/models";

export const CompanyContextSelector: React.FC = () => {
  const dispatch = useDispatch();
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
  };

  return <CompanyContextSelectorContainer onChange={handleOnChange} />;
};
