import React from "react";
import { StatusIcon } from "@konveyor/lib-ui";

import { FileCodeIcon } from "@patternfly/react-icons";

import { UBLDocument } from "api/models";

export interface ICellXMLProps {
  ublDocument: UBLDocument;
}

export const CellXML: React.FC<ICellXMLProps> = ({ ublDocument }) => {
  if (ublDocument.fileContentValid === false) {
    return (
      <StatusIcon
        status="Warning"
        label={ublDocument.fileContentValidationError}
      />
    );
  }

  if (ublDocument.fileContentValid === true && ublDocument.fileContent) {
    return (
      <>
        <FileCodeIcon key="fileCode-icon" />{" "}
        {ublDocument.fileContent.documentID}
      </>
    );
  }

  return <span>-</span>;
};
