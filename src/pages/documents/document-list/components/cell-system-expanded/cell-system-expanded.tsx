import React from "react";

import { UBLDocument } from "api/models";
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";

export interface ICellSystemExpandedProps {
  ublDocument: UBLDocument;
}

export const CellSystemExpanded: React.FC<ICellSystemExpandedProps> = ({
  ublDocument: item,
}) => {
  return (
    <DescriptionList className="pf-c-table__expandable-row-content">
      <DescriptionListGroup>
        <DescriptionListTerm>Número de reintentos</DescriptionListTerm>
        <DescriptionListDescription>
          {item.retryCount}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Error</DescriptionListTerm>
        <DescriptionListDescription>{item.error}</DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
