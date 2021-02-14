import { AxiosPromise } from "axios";
import { APIClient } from "axios-config";

import {
  Company,
  UBLDocument,
  PageQuery,
  PageRepresentation,
  SortByQuery,
} from "./models";

const USER_COMPANIES = "/user/companies";
const COMPANIES = "/companies";

export const DOCUMENTS = `${COMPANIES}/:company/documents`;

export const createCompany = (company: any): AxiosPromise<Company> => {
  return APIClient.post(USER_COMPANIES, company);
};

export const updateCompany = (company: any): AxiosPromise<Company> => {
  if (!company.name) {
    throw new Error("Company must have an name");
  }
  return APIClient.put(`${COMPANIES}/${company.name}`, company);
};

export const updateCompanySunatCredentials = (
  companyName: string,
  credentials: any
): AxiosPromise<Company> => {
  return APIClient.put(
    `${COMPANIES}/${companyName}/sunat-credentials`,
    credentials
  );
};

export const getCompanies = (
  pagination: PageQuery,
  sortBy?: SortByQuery,
  filterText?: string
): AxiosPromise<PageRepresentation<Company>> => {
  let sortByQuery: string | undefined = undefined;
  if (sortBy) {
    sortByQuery = `${sortBy.orderBy}:${sortBy.orderDirection}`;
  }

  const params = {
    filterText,
    offset: (pagination.page - 1) * pagination.perPage,
    limit: pagination.perPage,
    sort_by: sortByQuery,
  };

  const query: string[] = [];
  Object.keys(params).forEach((key) => {
    const value = (params as any)[key];
    if (value !== undefined) {
      query.push(`${key}=${value}`);
    }
  });

  return APIClient.get(`${USER_COMPANIES}?${query.join("&")}`);
};

export const deleteCompany = (company: Company): AxiosPromise => {
  return APIClient.delete(`${COMPANIES}/${company.name}`);
};

export const getCompany = (name: string): AxiosPromise<Company> => {
  return APIClient.get(`${COMPANIES}/${name}`);
};

//

export const getDocuments = (
  company: string,
  pagination: PageQuery,
  sortBy?: SortByQuery,
  filterText?: string
): AxiosPromise<PageRepresentation<UBLDocument>> => {
  let sortByQuery: string | undefined = undefined;
  if (sortBy) {
    sortByQuery = `${sortBy.orderBy}:${sortBy.orderDirection}`;
  }

  const params = {
    filterText,
    offset: (pagination.page - 1) * pagination.perPage,
    limit: pagination.perPage,
    sort_by: sortByQuery,
  };

  const query: string[] = [];
  Object.keys(params).forEach((key) => {
    const value = (params as any)[key];
    if (value !== undefined) {
      query.push(`${key}=${value}`);
    }
  });

  return APIClient.get(
    `${DOCUMENTS.replace(":company", company)}?${query.join("&")}`
  );
};
