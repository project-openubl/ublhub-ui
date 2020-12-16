import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { CompanytRoute } from "Paths";

export interface OverviewProps extends RouteComponentProps<CompanytRoute> {}

export const Overview: React.FC<OverviewProps> = () => {
  return <span>overview</span>;
};
