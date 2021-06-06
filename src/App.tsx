import React from "react";
import { BrowserRouter } from "react-router-dom";

import { AppRoutes } from "./Routes";
import "./App.scss";

import { DefaultLayout } from "./layout";
import { ConfirmDialogContainer } from "./shared/containers/confirm-dialog-container";

import NotificationsPortal from "@redhat-cloud-services/frontend-components-notifications/NotificationPortal";
import "@redhat-cloud-services/frontend-components-notifications/index.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <DefaultLayout>
        <AppRoutes />
      </DefaultLayout>
      <NotificationsPortal />
      <ConfirmDialogContainer />
    </BrowserRouter>
  );
};

export default App;
