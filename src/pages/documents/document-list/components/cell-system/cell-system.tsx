import React from "react";
import Moment from "react-moment";
import { StatusIcon } from "@konveyor/lib-ui";

import { Flex, FlexItem } from "@patternfly/react-core";

import { GhSpinner } from "shared/components/gh-spinner";

import { UBLDocument } from "api/models";

export interface ICellSystemProps {
  ublDocument: UBLDocument;
}

export const CellSystem: React.FC<ICellSystemProps> = ({
  ublDocument: item,
}) => {
  let systemColumnValue;
  if (item.inProgress) {
    systemColumnValue = (
      <Flex
        spaceItems={{ default: "spaceItemsSm" }}
        alignItems={{ default: "alignItemsCenter" }}
        flexWrap={{ default: "nowrap" }}
        style={{ whiteSpace: "nowrap" }}
      >
        <FlexItem>
          <GhSpinner size="sm" />
        </FlexItem>
        <FlexItem>En proceso</FlexItem>
      </Flex>
    );
  } else if (item.error) {
    systemColumnValue = <StatusIcon status="Error" label="Error" />;
  } else if (item.scheduledDelivery) {
    systemColumnValue = (
      <StatusIcon
        status="Paused"
        label={
          <>
            Retry <Moment fromNow>{item.scheduledDelivery}</Moment>
          </>
        }
      />
    );
  } else {
    systemColumnValue = <StatusIcon status="Ok" label="Ok" />;
  }

  return systemColumnValue;
};
