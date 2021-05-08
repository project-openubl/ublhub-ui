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

  namespaceList = "/namespaces",

  companyList = "/companies",
  newCompany = "/companies/~new",

  editCompany = "/companies/:company",
  editCompany_overview = "/companies/:company/overview",
  editCompany_details = "/companies/:company/details",
  editCompany_sunatCredentials = "/companies/:company/sunat-credentials",

  documentList_empty = "/documents/select-company",
  documentList = "/documents/company/:company/",
  newDocument = "/documents/company/:company/~new",
}

export interface OptionalCompanyRoute {
  company?: string;
}

export interface CompanytRoute {
  company: string;
}
