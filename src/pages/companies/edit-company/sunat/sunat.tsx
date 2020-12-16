import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { CompanytRoute } from "Paths";

export interface SunatProps extends RouteComponentProps<CompanytRoute> {}

export const Sunat: React.FC<SunatProps> = () => {
  return <span>sunat</span>;
};
