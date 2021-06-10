import { AxiosPromise } from "axios";
import { APIClient } from "axios-config";

import {
  Company,
  UBLDocument,
  PageQuery,
  PageRepresentation,
  Namespace,
  KeysMetadataRepresentation,
  ComponentRepresentation,
  ServerInfoRepresentation,
  InputModel,
} from "./models";

const USER_NAMESPACES = "/user/namespaces";
const NAMESPACES = "/namespaces";

const COMPANIES = "/namespaces/:namespaceId/companies";
const DOCUMENTS = "/namespaces/:namespaceId/documents";

type Direction = "asc" | "desc";

const headers = { Accept: "application/json" };

export const getUploadUrl = (namespaceId: string) => {
  return `${DOCUMENTS.replace(":namespaceId", namespaceId)}/upload`;
};

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

// Server info

export const getServerInfo = (): AxiosPromise<ServerInfoRepresentation> => {
  return APIClient.get("/server-info");
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

export const getCompanyKeys = (
  namespaceId: string,
  companyId: string
): AxiosPromise<KeysMetadataRepresentation> => {
  return APIClient.get(
    `${COMPANIES.replaceAll(":namespaceId", namespaceId)}/${companyId}/keys`
  );
};

export const getCompanyComponents = (
  namespaceId: string,
  companyId: string
): AxiosPromise<ComponentRepresentation[]> => {
  return APIClient.get(
    `${COMPANIES.replaceAll(
      ":namespaceId",
      namespaceId
    )}/${companyId}/components`
  );
};

export const createCompanyComponent = (
  namespaceId: string,
  companyId: string,
  component: ComponentRepresentation
): AxiosPromise<ComponentRepresentation> => {
  return APIClient.post(
    `${COMPANIES.replaceAll(
      ":namespaceId",
      namespaceId
    )}/${companyId}/components`,
    component
  );
};

export const updateCompanyComponent = (
  namespaceId: string,
  companyId: string,
  component: ComponentRepresentation
): AxiosPromise<ComponentRepresentation> => {
  return APIClient.put(
    `${COMPANIES.replaceAll(
      ":namespaceId",
      namespaceId
    )}/${companyId}/components/${component.id}`,
    component
  );
};

export const getCompanyComponent = (
  namespaceId: string,
  companyId: string,
  componentId: string
): AxiosPromise<ComponentRepresentation> => {
  return APIClient.get(
    `${COMPANIES.replaceAll(
      ":namespaceId",
      namespaceId
    )}/${companyId}/components/${componentId}`
  );
};

export const deleteCompanyComponent = (
  namespaceId: string,
  companyId: string,
  componentId: string
): AxiosPromise => {
  return APIClient.delete(
    `${COMPANIES.replaceAll(
      ":namespaceId",
      namespaceId
    )}/${companyId}/components/${componentId}`
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
  namespaceId: string,
  filters: {
    filterText?: string;
    ruc?: string[];
    documentType?: string[];
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
    }
    sortByQuery = `${field}:${sortBy.direction}`;
  }

  const params = {
    offset: (pagination.page - 1) * pagination.perPage,
    limit: pagination.perPage,
    sort_by: sortByQuery,

    filterText: filters.filterText,
    ruc: filters.ruc,
    documentType: filters.documentType,
  };

  const query: string[] = buildQuery(params);
  return APIClient.get(
    `${DOCUMENTS.replaceAll(":namespaceId", namespaceId)}?${query.join("&")}`
  );
};

export const createDocument = (
  namespaceId: string,
  inputModel: InputModel<any>
): AxiosPromise => {
  const url = `${DOCUMENTS.replaceAll(":namespaceId", namespaceId)}`;
  return APIClient.post(url, inputModel, {
    headers: { Accept: "application/json" },
  });
};

export const getDocumentFile = (
  namespaceId: string,
  documentId: string
): AxiosPromise<string> => {
  const url = `${DOCUMENTS.replaceAll(
    ":namespaceId",
    namespaceId
  )}/${documentId}/file`;

  return APIClient.get(url, {
    headers: {
      responseType: "blob",
    },
  });
};

export const getDocumentCdrFile = (
  namespaceId: string,
  documentId: string
): AxiosPromise<string> => {
  const url = `${DOCUMENTS.replaceAll(
    ":namespaceId",
    namespaceId
  )}/${documentId}/cdr`;

  return APIClient.get(url, {
    responseType: "arraybuffer",
    headers: {
      responseType: "blob",
    },
  });
};

export const retrySendDocument = (
  namespaceId: string,
  documentId: string
): AxiosPromise => {
  const url = `${DOCUMENTS.replaceAll(
    ":namespaceId",
    namespaceId
  )}/${documentId}/retry-send`;

  return APIClient.post(
    url,
    {},
    {
      headers: { Accept: "application/json" },
    }
  );
};
