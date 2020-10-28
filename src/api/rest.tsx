import { AxiosPromise } from "axios";
import { APIClient } from "axios-config";

import { Company } from "./models";

const USER_COMPANIES = "/user/companies";

export const createCompany = (company: any): AxiosPromise<Company> => {
  return APIClient.post(USER_COMPANIES, company);
};
