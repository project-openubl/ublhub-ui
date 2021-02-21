import { addNotification } from "@redhat-cloud-services/frontend-components-notifications/cjs/actions";

type Variant = "danger" | "success";

export const addAlert = (
  variant: Variant,
  title: string,
  description?: string
) => {
  return addNotification({
    variant,
    title,
    description,
  });
};

export const addSuccessAlert = (title: string, description?: string) => {
  return addAlert("success", title, description);
};

export const addErrorAlert = (title: string, description?: string) => {
  return addAlert("danger", title, description);
};
