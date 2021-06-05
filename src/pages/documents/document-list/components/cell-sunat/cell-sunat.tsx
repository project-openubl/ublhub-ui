import React from "react";
import { StatusIcon, StatusType } from "@konveyor/lib-ui";

import { UBLDocument, UBLDocumentSunat } from "api/models";

const formatSunatStatus = (status: string) => {
  const withSpace = status.replace(/_/g, " ").toLowerCase();
  return withSpace.charAt(0).toUpperCase() + withSpace.slice(1);
};

const getStatusType = (ublDocument: UBLDocumentSunat): StatusType => {
  switch (ublDocument.status) {
    case "ACEPTADO":
      return "Ok";
    case "RECHAZADO":
      return "Error";
    case "EXCEPCION":
      return "Error";
    case "BAJA":
      return "Warning";
    case "EN_PROCESO":
      return "Warning";
    default:
      return "Unknown";
  }
};

export interface ICellSUNATProps {
  ublDocument: UBLDocument;
}

export const CellSUNAT: React.FC<ICellSUNATProps> = ({ ublDocument: item }) => {
  return (
    <>
      {item.sunat && item.sunat.status && (
        <StatusIcon
          status={getStatusType(item.sunat)}
          label={formatSunatStatus(item.sunat.status)}
        />
      )}
      {item.sunat && !item.sunat.status && (
        <StatusIcon status={"Unknown"} label="Unknown" />
      )}
    </>
  );
};
