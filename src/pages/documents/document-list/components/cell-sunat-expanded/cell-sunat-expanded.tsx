import React from "react";

import { UBLDocument } from "api/models";
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";

export interface ICellSUNATExpandedProps {
  ublDocument: UBLDocument;
}

export const CellSUNATExpanded: React.FC<ICellSUNATExpandedProps> = ({
  ublDocument: item,
}) => {
  return (
    <DescriptionList className="pf-c-table__expandable-row-content">
      <DescriptionListGroup>
        <DescriptionListTerm>Estado</DescriptionListTerm>
        <DescriptionListDescription>
          {item.sunat?.status}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Código</DescriptionListTerm>
        <DescriptionListDescription>
          {item.sunat?.code}
        </DescriptionListDescription>
      </DescriptionListGroup>
      {item.sunat?.ticket && (
        <DescriptionListGroup>
          <DescriptionListTerm>Ticket</DescriptionListTerm>
          <DescriptionListDescription>
            {item.sunat?.description}
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}
      <DescriptionListGroup>
        <DescriptionListTerm>Descripción</DescriptionListTerm>
        <DescriptionListDescription>
          {item.sunat?.description}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
