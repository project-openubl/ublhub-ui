import { useCallback, useState } from "react";
import { AxiosError } from "axios";

import { deleteCompany } from "api/rest";
import { Company } from "api/models";

export interface IState {
  isDeleting: boolean;
  deleteCompany: (
    company: Company,
    onSuccess: () => void,
    onError: (error: AxiosError) => void
  ) => void;
}

export const useDeleteCompany = (): IState => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCompanyHandler = useCallback(
    (
      company: Company,
      onSuccess: () => void,
      onError: (error: AxiosError) => void
    ) => {
      setIsDeleting(true);
      deleteCompany(company)
        .then(() => {
          setIsDeleting(false);
          onSuccess();
        })
        .catch((error: AxiosError) => {
          setIsDeleting(false);
          onError(error);
        });
    },
    []
  );

  return {
    isDeleting,
    deleteCompany: deleteCompanyHandler,
  };
};

export default useDeleteCompany;
