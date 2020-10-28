export interface Company {
  name: string;
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
