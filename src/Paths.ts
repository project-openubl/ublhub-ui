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

  companyList = "/companies",
  newCompany = "/companies/~new",

  editCompany = "/companies/:company",
  editCompany_overview = "/companies/:company/overview",
  editCompany_sunat = "/companies/:company/sunat",

  documentList = "/documents",
  newDocument = "/documents/~new",
}

export interface OptionalCompanyRoute {
  company?: string;
}

export interface CompanytRoute {
  company: string;
}
