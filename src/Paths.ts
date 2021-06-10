export const formatPath = (path: Paths, data: any) => {
  let url = path as string;

  for (const k of Object.keys(data)) {
    url = url.replace(":" + k, data[k]);
  }

  return url;
};

export enum Paths {
  base = "/",
  notFound = "/not-found",

  // Namespaces
  namespaceList = "/namespaces",

  // Companies
  companyList_empty = "/ns-company/select-namespace",

  companyList = "/ns-company/:namespaceId/companies",
  newCompany = "/ns-company/:namespaceId/companies/~new",

  editCompany = "/ns-company/:namespaceId/companies/:companyId",
  editCompany_overview = "/ns-company/:namespaceId/companies/:companyId/overview",
  editCompany_details = "/ns-company/:namespaceId/companies/:companyId/details",
  editCompany_keys = "/ns-company/:namespaceId/companies/:companyId/keys",
  editCompany_keys_new = "/ns-company/:namespaceId/companies/:companyId/keys/:providerId/~new",
  editCompany_keys_edit = "/ns-company/:namespaceId/companies/:companyId/keys/:providerId/:componentId",

  // Documents
  documentList_empty = "/ns-document/select-company",

  documentList = "/ns-document/:namespaceId/documents",
  uploadDocument = "/ns-document/:namespaceId/documents/~upload",
  createDocument = "/ns-document/:namespaceId/documents/~new",
}

export interface OptionalCompanyRoute {
  company?: string;
}

export interface NamespaceRoute {
  namespaceId: string;
}

export interface CompanyRoute {
  namespaceId: string;
  companyId: string;
}

export interface NewKeyRoute extends CompanyRoute {
  providerId: string;
}

export interface EditKeyRoute extends CompanyRoute {
  providerId: string;
  componentId: string;
}
