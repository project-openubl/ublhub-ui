import { Paths } from "Paths";
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

import useFetchCompany from "./hooks/useFetchCompany";

export interface CompanyListProps {}

export const CompanyList: React.FC<CompanyListProps> = () => {
  const { companies, isFetching, fetchError, refresh } = useFetchCompany();

  useEffect(() => {
    refresh({});
  }, [refresh]);

  return (
    <>
      <NavLink to={Paths.newCompany} activeClassName="pf-m-current">
        New company
      </NavLink>
    </>
  );
};
