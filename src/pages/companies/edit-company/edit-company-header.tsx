import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Alert, PageSection, Skeleton } from "@patternfly/react-core";

import { useDeleteCompany, useFetchCompany } from "shared/hooks";

import { alertActions } from "store/alert";
import { deleteWithMatchModalActions } from "store/delete-with-match-modal";

import { CompanytRoute, formatPath, Paths } from "Paths";
import { getAxiosErrorMessage } from "utils/modelUtils";

import { PageHeader } from "./components/page-header";
import { ConditionalRender } from "shared/components";

export interface EditCompanyHeaderProps {}

export const EditCompanyHeader: React.FC<EditCompanyHeaderProps> = () => {
  const params = useParams<CompanytRoute>();
  const history = useHistory();

  const { deleteCompany } = useDeleteCompany();
  const { company, isFetching, fetchError, fetchCompany } = useFetchCompany();

  const dispatch = useDispatch();

  useEffect(() => {
    fetchCompany(params.company);
  }, [params, fetchCompany]);

  const handleOnEdit = () => {
    const path = formatPath(Paths.editCompany_sunat, {
      company: params.company,
    });
    history.push(path);
  };

  const handleOnDelete = () => {
    if (!company) {
      throw new Error("Company not defined, can not delete it");
    }

    dispatch(
      deleteWithMatchModalActions.openModal({
        title: "Delete company",
        message: `Are you sure you want to delete the company ${params.company}`,
        matchText: params.company,
        onDelete: () => {
          dispatch(deleteWithMatchModalActions.processing());
          deleteCompany(
            company,
            () => {
              dispatch(deleteWithMatchModalActions.closeModal());
              history.push(Paths.companyList);
            },
            (error) => {
              dispatch(deleteWithMatchModalActions.closeModal());
              dispatch(
                alertActions.addAlert(
                  "danger",
                  "Error",
                  getAxiosErrorMessage(error)
                )
              );
            }
          );
        },
      })
    );
  };

  if (fetchError) {
    return (
      <Alert
        variant="danger"
        isInline
        title={getAxiosErrorMessage(fetchError)}
      />
    );
  }

  return (
    <PageSection variant="light">
      <ConditionalRender
        when={isFetching}
        then={<Skeleton screenreaderText="Loading contents" />}
      >
        <PageHeader
          title={params.company}
          breadcrumbs={[
            {
              title: "Companies",
              path: Paths.companyList,
            },
            {
              title: "Company details",
              path: Paths.editCompany,
            },
          ]}
          menuActions={[
            { label: "Edit", callback: handleOnEdit },
            { label: "Delete", callback: handleOnDelete },
          ]}
          navItems={[
            {
              title: "Overview",
              path: formatPath(Paths.editCompany_overview, {
                company: params.company,
              }),
            },
            {
              title: "SUNAT",
              path: formatPath(Paths.editCompany_sunat, {
                company: params.company,
              }),
            },
          ]}
        />
      </ConditionalRender>
    </PageSection>
  );
};
