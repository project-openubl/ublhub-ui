import React from "react";
import {
  Card,
  CardTitle,
  CardBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from "@patternfly/react-core";
import { Company } from "api/models";

export interface CompanySunatDetailsProps {
  company: Company;
}

export const CompanySunatDetails: React.FC<CompanySunatDetailsProps> = ({
  company,
}) => {
  return (
    <Card>
      <CardTitle>SUNAT</CardTitle>
      <CardBody>
        <DescriptionList
          columnModifier={{
            default: "2Col",
          }}
        >
          <DescriptionListGroup>
            <DescriptionListTerm>Factura URL</DescriptionListTerm>
            <DescriptionListDescription>
              {company.webServices.factura}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Retención URL</DescriptionListTerm>
            <DescriptionListDescription>
              {company.webServices.retenciones}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Guía remisión URL</DescriptionListTerm>
            <DescriptionListDescription>
              {company.webServices.guia}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Username</DescriptionListTerm>
            <DescriptionListDescription>
              {company.credentials.username}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
};
