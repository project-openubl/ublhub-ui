import React, { useCallback, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Alert, Skeleton } from "@patternfly/react-core";

import { AppPageSection, ConditionalRender } from "shared/components";
import { useDelete, useFetch } from "shared/hooks";

import { alertActions } from "store/alert";
import { deleteWithMatchModalActions } from "store/delete-with-match-modal";

import { CompanyRoute, formatPath, Paths } from "Paths";
import { getAxiosErrorMessage } from "utils/modelUtils";

import { Company } from "api/models";
import { deleteCompany, getCompany } from "api/rest";

import { PageHeader } from "./components/page-header";

export interface EditCompanyHeaderProps {}

export const EditCompanyHeader: React.FC<EditCompanyHeaderProps> = () => {
  const history = useHistory();
  const { namespaceId, companyId } = useParams<CompanyRoute>();

  const dispatch = useDispatch();

  const { requestDelete: requestDeleteCompany } = useDelete({
    onDelete: (ns: Company) => deleteCompany(namespaceId, companyId),
  });

  const fetchCompany = useCallback(() => {
    return getCompany(namespaceId, companyId);
  }, [namespaceId, companyId]);

  const {
    data: company,
    isFetching: isFetchingCompany,
    fetchError: fetchErrorCompany,
    requestFetch: refreshCompany,
  } = useFetch<Company>({
    defaultIsFetching: true,
    onFetch: fetchCompany,
  });

  useEffect(() => {
    refreshCompany();
  }, [refreshCompany]);

  const redirectToCompanyListPage = () => {
    history.push(formatPath(Paths.companyList, { namespaceId }));
  };

  const handleOnDelete = () => {
    if (!company) {
      throw new Error("Company not defined, can not delete it");
    }

    dispatch(
      deleteWithMatchModalActions.openModal({
        title: "Eliminar empresa",
        message: `¿Estás seguro de querer eliminar la empresa RUC=${company.ruc} (${company.name})?`,
        matchText: company.ruc,
        onDelete: () => {
          dispatch(deleteWithMatchModalActions.processing());
          requestDeleteCompany(
            company,
            () => {
              dispatch(deleteWithMatchModalActions.closeModal());
              redirectToCompanyListPage();
            },
            (error) => {
              dispatch(deleteWithMatchModalActions.closeModal());
              dispatch(alertActions.addErrorAlert(getAxiosErrorMessage(error)));
            }
          );
        },
      })
    );
  };

  if (fetchErrorCompany) {
    return (
      <Alert
        variant="danger"
        isInline
        title={getAxiosErrorMessage(fetchErrorCompany)}
      />
    );
  }

  return (
    <AppPageSection>
      <ConditionalRender
        when={isFetchingCompany}
        then={<Skeleton screenreaderText="Loading contents" />}
      >
        <PageHeader
          title={company?.name || ""}
          breadcrumbs={[
            {
              title: "Empresas",
              path: formatPath(Paths.companyList, { namespaceId }),
            },
            {
              title: "detalle",
              path: "",
            },
          ]}
          menuActions={[{ label: "Eliminar", callback: handleOnDelete }]}
          navItems={[
            {
              title: "General",
              path: formatPath(Paths.editCompany_overview, {
                namespaceId,
                companyId,
              }),
            },
            {
              title: "Detalle",
              path: formatPath(Paths.editCompany_details, {
                namespaceId,
                companyId,
              }),
            },
            {
              title: "Certificados",
              path: formatPath(Paths.editCompany_keys, {
                namespaceId,
                companyId,
              }),
            },
          ]}
        />
      </ConditionalRender>
    </AppPageSection>
  );
};
