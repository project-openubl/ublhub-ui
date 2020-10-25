import { Paths } from "Paths";
import React from "react";
import { NavLink } from "react-router-dom";

export interface CompanyListProps {}

export const CompanyList: React.FC<CompanyListProps> = () => {
  return (
    <>
      <NavLink to={Paths.newCompany} activeClassName="pf-m-current">
        New company
      </NavLink>
    </>
  );
};
