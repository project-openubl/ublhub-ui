import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import configureStore from "./store";
import { initApi, initInterceptors } from "axios-config";

import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import { AppPlaceholder } from "shared/components";

it("renders without crashing", () => {
  const div = document.createElement("div");

  initApi();

  ReactDOM.render(
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{ onLoad: "login-required" }}
      LoadingComponent={<AppPlaceholder />}
      isLoadingCheck={(keycloak) => {
        if (keycloak.authenticated) {
          initInterceptors(() => {
            return new Promise<string>((resolve, reject) => {
              if (keycloak.token) {
                keycloak
                  .updateToken(5)
                  .then(() => resolve(keycloak.token!))
                  .catch(() => reject("Failed to refresh token"));
              } else {
                keycloak.login();
                reject("Not logged in");
              }
            });
          });
        }

        return !keycloak.authenticated;
      }}
    >
      <Provider store={configureStore()}>
        <App />
      </Provider>
    </ReactKeycloakProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
