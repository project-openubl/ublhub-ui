import { combineReducers } from "redux";
import { StateType } from "typesafe-actions";

import { notificationsReducer } from "@redhat-cloud-services/frontend-components-notifications/redux";

import {
  companyContextStateKey,
  companyContextReducer,
} from "./company-context";
import {
  deleteWithMatchModalStateKey,
  deleteWithMatchModalReducer,
} from "./delete-with-match-modal";

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  notifications: notificationsReducer,
  [companyContextStateKey]: companyContextReducer,
  [deleteWithMatchModalStateKey]: deleteWithMatchModalReducer,
});
