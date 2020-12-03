export interface PageQuery {
  page: number;
  perPage: number;
}

export interface SortByQuery {
  orderBy: string | undefined;
  orderDirection: "asc" | "desc";
}

export interface PageRepresentation<T> {
  meta: Meta;
  links: Links;
  data: T[];
}

export interface Meta {
  offset: number;
  limit: number;
  count: number;
}

export interface Links {
  first: string;
  next: string;
  previous: string;
  last: string;
}
export interface Company {
  id?: string;
  name: string;
  description?: string;
  sunatWsUrls: SUNATWsUrls;
  sunatCredentials: SUNATCredentials;
}

export interface SUNATWsUrls {
  factura: string;
  guia: string;
  retencion: string;
}

export interface SUNATCredentials {
  username: string;
  password: string;
}
