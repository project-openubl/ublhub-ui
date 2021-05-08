import { AxiosPromise } from "axios";
import { APIClient } from "axios-config";

import {
  Company,
  UBLDocument,
  PageQuery,
  PageRepresentation,
  Namespace,
} from "./models";

const USER_NAMESPACES = "/user/namespaces";
const NAMESPACES = "/namespaces";

const COMPANIES = "/namespaces/:namespaceId/companies";

export const DOCUMENTS = `${COMPANIES}/:company/documents`;

type Direction = "asc" | "desc";

const headers = { Accept: "application/json" };

const buildQuery = (params: any) => {
  const query: string[] = [];

  Object.keys(params).forEach((key) => {
    const value = (params as any)[key];

    if (value !== undefined && value !== null) {
      let queryParamValues: string[] = [];
      if (Array.isArray(value)) {
        queryParamValues = value;
      } else {
        queryParamValues = [value];
      }
      queryParamValues.forEach((v) => query.push(`${key}=${v}`));
    }
  });

  return query;
};

//

export enum NamespaceSortBy {
  name,
}

export interface NamespaceSortByQuery {
  field: NamespaceSortBy;
  direction?: Direction;
}

export const getNamespaces = (
  filters: {
    filterText?: string;
  },
  pagination: PageQuery,
  sortBy?: NamespaceSortByQuery
): AxiosPromise<PageRepresentation<Company>> => {
  let sortByQuery: string | undefined = undefined;
  if (sortBy) {
    let field;
    switch (sortBy.field) {
      case NamespaceSortBy.name:
        field = "name";
        break;
    }
    sortByQuery = `${field}:${sortBy.direction}`;
  }

  const params = {
    offset: (pagination.page - 1) * pagination.perPage,
    limit: pagination.perPage,
    sort_by: sortByQuery,

    filterText: filters.filterText,
  };

  const query: string[] = buildQuery(params);
  return APIClient.get(`${USER_NAMESPACES}?${query.join("&")}`, { headers });
};

export const createNamespace = (ns: Namespace): AxiosPromise => {
  return APIClient.post(`${USER_NAMESPACES}`, ns);
};

export const updateNamespace = (ns: Namespace): AxiosPromise => {
  return APIClient.put(`${NAMESPACES}/${ns.id}`, ns);
};

export const deleteNamespace = (ns: Namespace): AxiosPromise => {
  return APIClient.delete(`${NAMESPACES}/${ns.id}`);
};

//

export const createCompany = (
  namespaceId: string,
  company: any
): AxiosPromise<Company> => {
  return APIClient.post(
    COMPANIES.replaceAll(":namespaceId", namespaceId),
    company
  );
};

export const updateCompany = (
  namespaceId: string,
  company: Company
): AxiosPromise<Company> => {
  if (!company.id) {
    throw new Error("Company must have an name");
  }

  return APIClient.put(
    `${COMPANIES.replaceAll(":namespaceId", namespaceId)}/${company.id}`,
    company
  );
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

export enum CompanySortBy {
  NAME,
}
export interface CompanySortByQuery {
  field: CompanySortBy;
  direction?: Direction;
}

export const getCompanies = (
  namespaceId: string,
  filters: {
    filterText?: string;
  },
  pagination: PageQuery,
  sortBy?: CompanySortByQuery
): AxiosPromise<PageRepresentation<Company>> => {
  let sortByQuery: string | undefined = undefined;
  if (sortBy) {
    let field;
    switch (sortBy.field) {
      case CompanySortBy.NAME:
        field = "name";
        break;
    }
    sortByQuery = `${field}:${sortBy.direction}`;
  }

  const params = {
    offset: (pagination.page - 1) * pagination.perPage,
    limit: pagination.perPage,
    sort_by: sortByQuery,
    filterText: filters.filterText,
  };

  const query: string[] = buildQuery(params);
  return APIClient.get(
    `${COMPANIES.replaceAll(":namespaceId", namespaceId)}?${query.join("&")}`
  );
};

export const deleteCompany = (
  namespaceId: string,
  companyId: string
): AxiosPromise => {
  return APIClient.delete(
    `${COMPANIES.replaceAll(":namespaceId", namespaceId)}/${companyId}`
  );
};

export const getCompany = (
  namespaceId: string,
  companyId: string
): AxiosPromise<Company> => {
  return APIClient.get(
    `${COMPANIES.replaceAll(":namespaceId", namespaceId)}/${companyId}`
  );
};

//

export enum UBLDocumentSortBy {
  DOCUMENT_ID,
}
export interface UBLDocumentSortByQuery {
  field: UBLDocumentSortBy;
  direction?: Direction;
}

export const getDocuments = (
  company: string,
  filters: {
    filterText?: string;
  },
  pagination: PageQuery,
  sortBy?: UBLDocumentSortByQuery
): AxiosPromise<PageRepresentation<UBLDocument>> => {
  let sortByQuery: string | undefined = undefined;
  if (sortBy) {
    let field;
    switch (sortBy.field) {
      case UBLDocumentSortBy.DOCUMENT_ID:
        field = "documentID";
        break;
      default:
        throw new Error("Could not define SortBy field name");
    }
    sortByQuery = `${field}:${sortBy.direction}`;
  }

  const query: string[] = [];

  const params = {
    offset: (pagination.page - 1) * pagination.perPage,
    limit: pagination.perPage,
    sort_by: sortByQuery,
    filterText: filters.filterText,
  };

  Object.keys(params).forEach((key) => {
    const value = (params as any)[key];

    if (value !== undefined && value !== null) {
      let queryParamValues: string[] = [];
      if (Array.isArray(value)) {
        queryParamValues = value;
      } else {
        queryParamValues = [value];
      }
      queryParamValues.forEach((v) => query.push(`${key}=${v}`));
    }
  });

  return APIClient.get(
    `${DOCUMENTS.replace(":company", company)}?${query.join("&")}`
  );
};
