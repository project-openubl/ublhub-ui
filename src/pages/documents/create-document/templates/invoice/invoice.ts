import { InputModel, InvoiceInputModel } from "api/models";

export const DEFAULT_INVOICE: InputModel<InvoiceInputModel> = {
  kind: "INVOICE",
  spec: {
    serie: "F001",
    numero: 1,
    proveedor: {
      ruc: "11111111111",
      razonSocial: "Razón social del emisor",
    },
    cliente: {
      tipoDocumentoIdentidad: "RUC",
      numeroDocumentoIdentidad: "22222222222",
      nombre: "Nombre de mi cliente",
    },
    detalle: [
      {
        descripcion: "Item1",
        cantidad: 1,
        precioUnitario: 100,
      },
    ],
  },
};
