import { addNotification } from "@redhat-cloud-services/frontend-components-notifications/cjs/actions";

type Variant = "danger" | "success";

export const addAlert = (
  variant: Variant,
  title: string,
  description: string
) => {
  return addNotification({
    variant,
    title,
    description,
  });
};
