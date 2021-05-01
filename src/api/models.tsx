export type EntityEventType = "CREATED" | "UPDATED" | "DELETED";

export interface WsMessage {
  type: "event";
  spec: EntityEvent;
}

export interface EntityEvent {
  id: string;
  event: EntityEventType;
  entity: string;
}

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

export type DeliveryStatus =
  | "SCHEDULED_TO_DELIVER"
  | "NEED_TO_CHECK_TICKET"
  | "COULD_NOT_BE_DELIVERED"
  | "DELIVERED";

export interface UBLDocument {
  id?: string;
  createdOn: number;

  retries: number;
  willRetryOn: number;

  fileContentValid?: boolean;
  fileContentValidationError?: string;
  fileContent?: UBLDocumentFileContent;

  sunat?: UBLDocumentSunat;
  sunatDeliveryStatus: DeliveryStatus;
  sunatEvents: UBLDocumentEvent[];
}

export interface UBLDocumentFileContent {
  ruc: string;
  documentID: string;
  documentType: string;
}

export interface UBLDocumentSunat {
  code: string;
  status: "ACEPTADO" | "RECHAZADO" | "EXCEPCION" | "BAJA" | "EN_PROCESO";
  description: string;
  ticket: string;
}

export interface UBLDocumentEvent {
  status: "default" | "success" | "danger" | "warning" | "info";
  description: string;
  createdOn: number;
}
