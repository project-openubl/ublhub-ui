import React from "react";
import { HashRouter } from "react-router-dom";

import { AppRoutes } from "./Routes";
import "./App.scss";

import { DefaultLayout } from "./layout";

import NotificationsPortal from "@redhat-cloud-services/frontend-components-notifications/NotificationPortal";
import "@redhat-cloud-services/frontend-components-notifications/index.css";

const App: React.FC = () => {
  return (
    <HashRouter>
      <DefaultLayout>
        <AppRoutes />
      </DefaultLayout>
      <NotificationsPortal />
    </HashRouter>
  );
};

export default App;
