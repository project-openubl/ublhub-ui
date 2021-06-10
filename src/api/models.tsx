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

export interface Namespace {
  id?: string;
  name: string;
  description?: string;
}

export interface Company {
  id?: string;
  ruc: string;
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
  inProgress: boolean;
  error?: string;
  scheduledDelivery?: number;
  retryCount: number;

  fileContentValid?: boolean;
  fileContentValidationError?: string;
  fileContent?: UBLDocumentFileContent;

  sunat?: UBLDocumentSunat;
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
  hasCdr: boolean;
}

export interface UBLDocumentEvent {
  status: "default" | "success" | "danger" | "warning" | "info";
  description: string;
  createdOn: number;
}

//

export interface ServerInfoRepresentation {
  componentTypes: ComponentTypes;
}

export interface KeysMetadataRepresentation {
  active: { [key: string]: string };
  keys: KeyMetadataRepresentation[];
}

export interface KeyMetadataRepresentation {
  providerId: string;
  providerPriority: number;
  kid: string;
  status: "ACTIVE" | "PASSIVE" | "DISABLED";
  type: string;
  algorithm: string;
  publicKey: string;
  certificate: string;
  // This does not come from backend but from UI
  provider?: ComponentRepresentation;
}

export interface ComponentRepresentation {
  id: string;
  name: string;
  providerId: string;
  providerType: string;
  parentId: string;
  subType: string;
  config: { [key: string]: string[] };
}

export interface ServerInfoRepresentation {
  componentTypes: ComponentTypes;
}

export interface ComponentTypes {
  keyProviders: ComponentTypeRepresentation[];
}

export interface ComponentTypeRepresentation {
  id: string;
  helpText: string;
  properties: ConfigPropertyRepresentation[];
}

export interface ConfigPropertyRepresentation {
  name: string;
  label: string;
  helpText: string;
  type: string;
  defaultValue: string;
  options: string[];
  secret: boolean;
}

// Documents
export type DocumentType = "INVOICE" | "CREDIT_NOTE";

export interface InputModel<T> {
  kind: DocumentType;
  spec: T;
}

export interface InvoiceInputModel {
  serie: string;
  numero: number;
  proveedor: {
    ruc: string;
    razonSocial: string;
  };
  cliente: {
    tipoDocumentoIdentidad: string;
    numeroDocumentoIdentidad: string;
    nombre: string;
  };
  detalle: DocumentLineInputModel[];
}

export interface CreditNoteInputModel {
  serie: string;
  numero: number;
  serieNumeroComprobanteAfectado: string;
  descripcionSustentoDeNota: string
  proveedor: {
    ruc: string;
    razonSocial: string;
  };
  cliente: {
    tipoDocumentoIdentidad: string;
    numeroDocumentoIdentidad: string;
    nombre: string;
  };
  detalle: DocumentLineInputModel[];
}

export interface DocumentLineInputModel {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
}
