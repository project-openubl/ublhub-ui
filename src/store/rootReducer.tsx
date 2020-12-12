import { combineReducers } from "redux";
import { StateType } from "typesafe-actions";

import notifications from "@redhat-cloud-services/frontend-components-notifications/cjs/notifications";

import {
  deleteWithMatchModalStateKey,
  deleteWithMatchModalReducer,
} from "./delete-with-match-modal";

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  notifications: notifications,
  [deleteWithMatchModalStateKey]: deleteWithMatchModalReducer,
});
