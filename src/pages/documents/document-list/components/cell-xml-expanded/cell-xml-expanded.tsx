import React from "react";
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import { UBLDocument } from "api/models";

export interface ICellXMLExpandedProps {
  ublDocument: UBLDocument;
}

export const CellXMLExpanded: React.FC<ICellXMLExpandedProps> = ({
  ublDocument: item,
}) => {
  return (
    <DescriptionList className="pf-c-table__expandable-row-content">
      <DescriptionListGroup>
        <DescriptionListTerm>Tipo</DescriptionListTerm>
        <DescriptionListDescription>
          {item.fileContent?.documentType}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>ID</DescriptionListTerm>
        <DescriptionListDescription>
          {item.fileContent?.documentID}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>RUC</DescriptionListTerm>
        <DescriptionListDescription>
          {item.fileContent?.ruc}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
