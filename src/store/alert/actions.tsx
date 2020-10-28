import { Dispatch } from "redux";
const frontendComponentsNotifications = require("@redhat-cloud-services/frontend-components-notifications/cjs/actions");
const addNotification = frontendComponentsNotifications.addNotification;

type Variant = "danger" | "success";

export const addAlert = (
  variant: Variant,
  title: string,
  description: string
) => {
  return (dispatch: Dispatch) => {
    dispatch(
      addNotification({
        variant,
        title,
        description,
      })
    );
  };
};
