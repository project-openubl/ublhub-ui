export interface PageQuery {
  page: number;
  perPage: number;
}

export interface SortByQuery {
  index: number;
  direction: "asc" | "desc";
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
  webServices: SUNATWsUrls;
  credentials: SUNATCredentials;
}

export interface SUNATWsUrls {
  factura: string;
  guia: string;
  retenciones: string;
}

export interface SUNATCredentials {
  username: string;
  password?: string;
}

export interface UBLDocument {
  id?: string;
  deliveryStatus: string;
  fileInfo: FileInfo;
}

export interface FileInfo {
  documentID: string;
  documentType: string;
  filename: string;
  ruc: string;
}
