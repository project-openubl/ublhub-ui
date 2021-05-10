import React from "react";

import { Flex, FlexItem, SpinnerProps } from "@patternfly/react-core";
import {
  CircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InfoCircleIcon,
  QuestionCircleIcon,
} from "@patternfly/react-icons";
import { SVGIconProps } from "@patternfly/react-icons/dist/js/createIcon";
import {
  global_disabled_color_200 as disabledColor,
  global_success_color_100 as successColor,
  global_warning_color_100 as warningColor,
  global_Color_dark_200 as unknownColor,
  global_danger_color_100 as errorColor,
  global_info_color_100 as infoColor,
} from "@patternfly/react-tokens";

import { GhSpinner } from "../gh-spinner";

export type StatusType =
  | "Scheduled"
  | "InProgress"
  | "Success"
  | "Error"
  | "Info"
  | "Unknown";

type IconListType = {
  [key in StatusType]: {
    Icon:
      | React.ComponentClass<SVGIconProps>
      | React.FunctionComponent<SpinnerProps>;
    color: { name: string; value: string; var: string };
  };
};
const iconList: IconListType = {
  Scheduled: {
    Icon: CircleIcon,
    color: warningColor,
  },
  InProgress: {
    Icon: GhSpinner,
    color: warningColor,
  },
  Success: {
    Icon: CheckCircleIcon,
    color: successColor,
  },
  Error: {
    Icon: ExclamationCircleIcon,
    color: errorColor,
  },
  Info: {
    Icon: InfoCircleIcon,
    color: infoColor,
  },
  Unknown: {
    Icon: QuestionCircleIcon,
    color: unknownColor,
  },
};

export interface DocumentStatusProps {
  status: StatusType;
  label?: React.ReactNode;
  isDisabled?: boolean;
  className?: string;
}

export const DocumentStatus: React.FC<DocumentStatusProps> = ({
  status,
  label,
  isDisabled = false,
  className = "",
}) => {
  const Icon = iconList[status].Icon;
  const icon = (
    <Icon
      color={isDisabled ? disabledColor.value : iconList[status].color.value}
      className={
        status === "InProgress"
          ? `${className} status-icon-loading-spinner`
          : className
      }
    />
  );

  if (label) {
    return (
      <Flex
        spaceItems={{ default: "spaceItemsSm" }}
        alignItems={{ default: "alignItemsCenter" }}
        flexWrap={{ default: "nowrap" }}
        style={{ whiteSpace: "nowrap" }}
        className={className}
      >
        <FlexItem>{icon}</FlexItem>
        <FlexItem>{label}</FlexItem>
      </Flex>
    );
  }

  return icon;
};
