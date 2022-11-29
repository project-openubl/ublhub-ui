import { CreditNoteInputModel, InputModel } from "api/models";

export const DEFAULT_CREDIT_NOTE: InputModel<CreditNoteInputModel> = {
  kind: "CREDIT_NOTE",
  spec: {
    serie: "FC01",
    numero: 1,
    serieNumeroComprobanteAfectado: "F001-1",
    descripcionSustentoDeNota: "tu descripción sustento",
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
